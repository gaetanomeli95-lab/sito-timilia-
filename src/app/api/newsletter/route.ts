import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email obbligatoria" },
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
