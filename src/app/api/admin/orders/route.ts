import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { sendOrderStatusUpdateEmail } from "@/lib/email";

async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;

  const token = authHeader.replace("Bearer ", "");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const tempClient = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error } = await tempClient.auth.getUser(token);
  if (error || !user) return false;

  const { data: profile } = await supabaseAdmin
    .from("customers")
    .select("is_admin")
    .eq("auth_id", user.id);

  if (!profile || profile.length === 0) return false;

  return profile[0].is_admin === true;
}

export async function GET(request: NextRequest) {
  try {
    if (!await verifyAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: data });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
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
