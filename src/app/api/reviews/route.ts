import { NextRequest, NextResponse } from "next/server";
import { storage, Review } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerEmail, rating, text } = body;

    if (!customerEmail || !rating || !text) {
      return NextResponse.json(
        { error: "Email, valutazione e testo sono obbligatori" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "La valutazione deve essere tra 1 e 5" },
        { status: 400 }
      );
    }

    const customer = await storage.findCustomerByEmail(customerEmail);
    if (!customer) {
      return NextResponse.json(
        { error: "Cliente non trovato. Registrati prima di lasciare una recensione." },
        { status: 404 }
      );
    }

    if (!customer.verified) {
      return NextResponse.json(
        { error: "Account non verificato. Verifica la tua email prima di lasciare una recensione." },
        { status: 403 }
      );
    }

    const review: Review = {
      id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      customerId: customer.id,
      customerName: customer.name,
      rating,
      text,
      approved: false,
      createdAt: new Date().toISOString(),
    };

    await storage.addReview(review);

    return NextResponse.json(
      { success: true, message: "Recensione inviata! Sarà visibile dopo approvazione.", review },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Errore durante l'invio della recensione" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const reviews = await storage.getApprovedReviews();
    return NextResponse.json({ reviews });
  } catch {
    return NextResponse.json(
      { error: "Errore nel recupero recensioni" },
      { status: 500 }
    );
  }
}
