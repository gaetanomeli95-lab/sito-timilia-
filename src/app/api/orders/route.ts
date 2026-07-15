import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendOrderConfirmationEmail, sendOrderNotificationToAdmin } from "@/lib/email";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerEmail, customerName, customerPhone, shippingAddress, shippingCity, shippingZip, items, notes, shippingCost, couponCode, couponDiscount, total: clientTotal } = body;

    if (!customerName || !customerEmail || !shippingAddress || !items?.length) {
      return NextResponse.json(
        { error: "Nome, email, indirizzo e articoli sono obbligatori" },
        { status: 400 }
      );
    }

    const itemsTotal = items.reduce(
      (sum: number, item: OrderItem) => sum + item.price * item.quantity,
      0
    );
    const shipping = shippingCost !== undefined ? shippingCost : (itemsTotal >= 50 ? 0 : 5.90);
    const discount = couponDiscount || 0;
    const total = clientTotal !== undefined ? clientTotal : (itemsTotal - discount + shipping);

    const { data: customer } = await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("email", customerEmail)
      .single();

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_id: customer?.id || null,
        customer_email: customerEmail,
        items,
        subtotal: itemsTotal,
        shipping_cost: shipping,
        coupon_code: couponCode || null,
        coupon_discount: discount,
        total,
        shipping_name: customerName,
        shipping_address: shippingAddress,
        shipping_city: shippingCity || null,
        shipping_zip: shippingZip || null,
        shipping_phone: customerPhone || null,
        notes: notes || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Errore durante l'elaborazione dell'ordine" },
        { status: 500 }
      );
    }

    // Send confirmation emails
    if (order) {
      await sendOrderConfirmationEmail({
        orderId: order.id,
        customerName,
        customerEmail,
        items,
        total,
        shippingAddress,
        shippingCity,
        shippingZip,
        shippingPhone: customerPhone || undefined,
        notes,
        status: "pending",
      });
      await sendOrderNotificationToAdmin({
        orderId: order.id,
        customerName,
        customerEmail,
        items,
        total,
        shippingAddress,
        shippingCity,
        shippingZip,
        shippingPhone: customerPhone || undefined,
        notes,
        status: "pending",
      });
    }

    return NextResponse.json(
      { success: true, message: "Ordine ricevuto! Ti contatteremo per la conferma.", order },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Errore durante l'elaborazione dell'ordine" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ orders: [] });
    }

    return NextResponse.json({ orders: data });
  } catch {
    return NextResponse.json({ orders: [] });
  }
}
