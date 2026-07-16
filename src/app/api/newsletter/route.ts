import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit } from "@/lib/server-auth";

export async function POST(request: NextRequest) {
  try {
    if (!rateLimit(request, 5, 60_000)) {
      return NextResponse.json(
        { error: "Troppe richieste. Riprova tra qualche minuto." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: "Indirizzo email non valido" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .upsert({ email }, { onConflict: "email" });

    if (error) {
      return NextResponse.json(
        { error: "Errore durante l'iscrizione" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Iscrizione completata!" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Errore durante l'iscrizione" },
      { status: 500 }
    );
  }
}
