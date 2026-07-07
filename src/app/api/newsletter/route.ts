import { NextRequest, NextResponse } from "next/server";
import { storage, NewsletterSubscriber } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email obbligatoria" },
        { status: 400 }
      );
    }

    const subscriber: NewsletterSubscriber = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      email,
      name: name || undefined,
      createdAt: new Date().toISOString(),
    };

    await storage.addSubscriber(subscriber);

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
