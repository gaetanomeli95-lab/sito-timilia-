import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { calculateOrder } from "@/lib/commerce";
import { getStripe } from "@/lib/stripe";

function cleanString(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const customerName = cleanString(body.customerName, 120);
    const customerEmail = cleanString(body.customerEmail, 254).toLowerCase();
    const customerPhone = cleanString(body.customerPhone, 40);
    const shippingAddress = cleanString(body.shippingAddress, 250);
    const shippingCity = cleanString(body.shippingCity, 100);
    const shippingZip = cleanString(body.shippingZip, 20);
    const notes = cleanString(body.notes, 500);

    if (!customerName || !customerEmail || !shippingAddress || !shippingCity || !shippingZip) {
      return NextResponse.json(
        { error: "Nome, email e indirizzo completo sono obbligatori" },
        { status: 400 }
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(customerEmail)) {
      return NextResponse.json({ error: "Indirizzo email non valido" }, { status: 400 });
    }

    const calculation = calculateOrder(body.items, body.couponCode);

    const { data: customers } = await supabaseAdmin
      .from("customers")
      .select("id")
      .ilike("email", customerEmail)
      .limit(1);

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_id: customers?.[0]?.id || null,
        customer_email: customerEmail,
        items: calculation.items,
        subtotal: calculation.subtotal,
        shipping_cost: calculation.shippingCost,
        coupon_code: calculation.couponCode,
        coupon_discount: calculation.couponDiscount,
        total: calculation.total,
        shipping_name: customerName,
        shipping_address: shippingAddress,
        shipping_city: shippingCity,
        shipping_zip: shippingZip,
        shipping_phone: customerPhone || null,
        notes: notes || null,
        status: "pending",
        payment_status: "unpaid",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Order creation error:", orderError);
      return NextResponse.json(
        { error: "Impossibile creare l'ordine" },
        { status: 500 }
      );
    }

    try {
      const stripe = getStripe();
      const lineItems = calculation.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: item.productName,
          },
        },
      }));

      if (calculation.shippingCost > 0) {
        lineItems.push({
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(calculation.shippingCost * 100),
            product_data: {
              name: "Spedizione",
            },
          },
        });
      }

      const origin = request.nextUrl.origin;
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: customerEmail,
        client_reference_id: order.id,
        line_items: lineItems,
        metadata: { order_id: order.id },
        payment_intent_data: {
          metadata: { order_id: order.id },
        },
        success_url: `${origin}/tera?payment=success&session_id={CHECKOUT_SESSION_ID}#shop`,
        cancel_url: `${origin}/tera?payment=cancelled#shop`,
      });

      await supabaseAdmin
        .from("orders")
        .update({ stripe_checkout_session_id: session.id })
        .eq("id", order.id);

      return NextResponse.json({ url: session.url });
    } catch (stripeError) {
      console.error("Stripe checkout error:", stripeError);
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      return NextResponse.json(
        { error: "Pagamento Stripe non disponibile. Verifica la configurazione." },
        { status: 503 }
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore durante il checkout";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
