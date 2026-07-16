import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit } from "@/lib/server-auth";

export async function POST(request: NextRequest) {
  try {
    if (!rateLimit(request, 3, 60_000)) {
      return NextResponse.json(
        { error: "Troppe richieste. Riprova tra qualche minuto." },
        { status: 429 }
      );
    }
    const body = await request.json();
    const authId = typeof body.authId === "string" ? body.authId : "";
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 40) : "";
    const newsletterConsent = body.newsletterConsent === true;

    if (!authId || !name || !email) {
      return NextResponse.json(
        { error: "authId, nome e email sono obbligatori" },
        { status: 400 }
      );
    }

    const { data: authUser, error: authUserError } = await supabaseAdmin.auth.admin.getUserById(authId);
    if (authUserError || !authUser.user || authUser.user.email?.toLowerCase() !== email) {
      return NextResponse.json({ error: "Identità utente non valida" }, { status: 401 });
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
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
