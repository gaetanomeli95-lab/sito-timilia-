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
      const { data: updatedOrder, error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          status: "paid",
          payment_status: "paid",
          stripe_payment_intent_id:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
          paid_at: new Date().toISOString(),
        })
        .eq("id", orderId)
        .eq("payment_status", "unpaid")
        .select("*")
        .single();

      if (updateError || !updatedOrder) {
        return NextResponse.json({ received: true });
      }

      const emailData = {
        orderId: updatedOrder.id,
        customerName: updatedOrder.shipping_name,
        customerEmail: updatedOrder.customer_email,
        items: updatedOrder.items,
        total: Number(updatedOrder.total),
        shippingAddress: updatedOrder.shipping_address,
        shippingCity: updatedOrder.shipping_city || undefined,
        shippingZip: updatedOrder.shipping_zip || undefined,
        shippingPhone: updatedOrder.shipping_phone || undefined,
        notes: updatedOrder.notes || undefined,
        status: "paid",
      };

      void Promise.all([
        sendOrderConfirmationEmail(emailData),
        sendOrderNotificationToAdmin(emailData),
      ]).catch((err) => console.error("Email send error:", err));
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id || session.client_reference_id;

    if (orderId) {
      await supabaseAdmin
        .from("orders")
        .update({ status: "cancelled", payment_status: "expired" })
        .eq("id", orderId)
        .eq("payment_status", "unpaid");
    }
  }

  return NextResponse.json({ received: true });
}
