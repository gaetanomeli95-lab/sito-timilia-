import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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

    const { data: customers, error: customerError } = await supabaseAdmin
      .from("customers")
      .select("id, name")
      .ilike("email", customerEmail);

    if (customerError || !customers || customers.length === 0) {
      return NextResponse.json(
        { error: "Cliente non trovato. Registrati prima di lasciare una recensione." },
        { status: 404 }
      );
    }

    const customer = customers[0];

    const { error: reviewError } = await supabaseAdmin
      .from("reviews")
      .insert({
        customer_id: customer.id,
        customer_name: customer.name,
        rating,
        text,
        approved: false,
      });

    if (reviewError) {
      console.error("Review insert error:", reviewError);
      return NextResponse.json(
        { error: "Errore durante l'invio della recensione", details: reviewError.message },
        { status: 500 }
      );
    }

    console.log("Review inserted successfully for customer:", customer.id);

    return NextResponse.json(
      { success: true, message: "Recensione inviata! Sarà visibile dopo approvazione." },
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
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("id, customer_name, rating, text, created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Errore nel recupero recensioni" },
        { status: 500 }
      );
    }

    const reviews = (data || []).map((r) => ({
      id: r.id,
      customerName: r.customer_name,
      rating: r.rating,
      text: r.text,
      createdAt: r.created_at,
    }));

    return NextResponse.json({ reviews });
  } catch {
    return NextResponse.json(
      { error: "Errore nel recupero recensioni" },
      { status: 500 }
    );
  }
}
