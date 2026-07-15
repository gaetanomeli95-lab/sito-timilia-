import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";
import { sendOrderConfirmationEmail, sendOrderNotificationToAdmin } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!webhookSecret || !signature) {
    return NextResponse.json({ error: "Webhook non configurato" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const payload = await request.text();
    event = getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature error:", error);
    return NextResponse.json({ error: "Firma webhook non valida" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id || session.client_reference_id;

    if (orderId && session.payment_status === "paid") {
      const { data: existingOrder } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (existingOrder && existingOrder.payment_status !== "paid") {
        const { data: order, error } = await supabaseAdmin
          .from("orders")
          .update({
            status: "paid",
            payment_status: "paid",
            stripe_payment_intent_id:
              typeof session.payment_intent === "string" ? session.payment_intent : null,
            paid_at: new Date().toISOString(),
          })
          .eq("id", orderId)
          .select("*")
          .single();

        if (error || !order) {
          console.error("Paid order update error:", error);
          return NextResponse.json({ error: "Aggiornamento ordine fallito" }, { status: 500 });
        }

        const emailData = {
          orderId: order.id,
          customerName: order.shipping_name,
          customerEmail: order.customer_email,
          items: order.items,
          total: Number(order.total),
          shippingAddress: order.shipping_address,
          shippingCity: order.shipping_city || undefined,
          shippingZip: order.shipping_zip || undefined,
          shippingPhone: order.shipping_phone || undefined,
          notes: order.notes || undefined,
          status: "paid",
        };

        await Promise.all([
          sendOrderConfirmationEmail(emailData),
          sendOrderNotificationToAdmin(emailData),
        ]);
      }
    }
  }

  return NextResponse.json({ received: true });
}
