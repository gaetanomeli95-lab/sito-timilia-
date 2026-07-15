import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { authId, name, email, phone, newsletterConsent } = body;

    if (!authId || !name || !email) {
      return NextResponse.json(
        { error: "authId, nome e email sono obbligatori" },
        { status: 400 }
      );
    }

    const { error: profileError } = await supabaseAdmin
      .from("customers")
      .insert({
        auth_id: authId,
        name,
        email,
        phone: phone || null,
        newsletter_consent: !!newsletterConsent,
      });

    if (profileError) {
      if (profileError.code === "23505") {
        return NextResponse.json(
          { error: "Un account con questa email esiste già" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Errore durante la creazione del profilo" },
        { status: 500 }
      );
    }

    if (newsletterConsent) {
      await supabaseAdmin
        .from("newsletter_subscribers")
        .upsert({ email }, { onConflict: "email" });
    }

    return NextResponse.json(
      { success: true, message: "Profilo creato con successo" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Errore durante la registrazione" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("customers")
      .select("id, name, email, phone, newsletter_consent, created_at");

    if (error) {
      return NextResponse.json(
        { error: "Errore nel recupero clienti" },
        { status: 500 }
      );
    }

    return NextResponse.json({ customers: data });
  } catch {
    return NextResponse.json(
      { error: "Errore nel recupero clienti" },
      { status: 500 }
    );
  }
}
