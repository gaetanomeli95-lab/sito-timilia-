import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdmin, rateLimit } from "@/lib/server-auth";
import { sendOrderStatusUpdateEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    if (!rateLimit(request, 30, 60_000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    if (!await verifyAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
    const limit = 50;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: data, totalPages: count ? Math.ceil(count / limit) : 1, page });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!rateLimit(request, 20, 60_000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    if (!await verifyAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id, status, trackingNumber } = await request.json();
    const allowedStatuses = ["pending", "preparing", "shipped", "delivered"];

    if (!id || !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Stato ordine non valido" }, { status: 400 });
    }

    const { data: currentOrder } = await supabaseAdmin
      .from("orders")
      .select("status, payment_status, tracking_number")
      .eq("id", id)
      .single();

    if (!currentOrder) {
      return NextResponse.json({ error: "Ordine non trovato" }, { status: 404 });
    }

    if (["preparing", "shipped", "delivered"].includes(status) && currentOrder.payment_status !== "paid") {
      return NextResponse.json({ error: "L'ordine non è ancora pagato" }, { status: 409 });
    }

    const normalizedTracking = typeof trackingNumber === "string" ? trackingNumber.trim() : "";
    if (status === "shipped" && !normalizedTracking && !currentOrder.tracking_number) {
      return NextResponse.json({ error: "Inserisci il codice tracking" }, { status: 400 });
    }

    if (currentOrder.status === status && (!normalizedTracking || normalizedTracking === currentOrder.tracking_number)) {
      return NextResponse.json({ success: true });
    }

    const updateData: Record<string, string> = { status };
    if (normalizedTracking) {
      updateData.tracking_number = normalizedTracking;
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select("id, customer_email, shipping_name")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send status update email to customer
    if (order) {
      await sendOrderStatusUpdateEmail(
        order.customer_email,
        order.shipping_name,
        order.id,
        status,
        normalizedTracking || currentOrder.tracking_number || undefined
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
