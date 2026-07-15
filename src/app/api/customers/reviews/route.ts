import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const customerId = request.nextUrl.searchParams.get("customerId");
    if (!customerId) {
      return NextResponse.json({ error: "Missing customer id" }, { status: 400 });
    }

    const { data: allReviews, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message, details: "query error" }, { status: 500 });
    }

    const reviews = (allReviews || []).filter((r) => r.customer_id === customerId);

    return NextResponse.json({ reviews });
  } catch (e) {
    return NextResponse.json({ error: "Server error", details: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing review id" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error", details: String(e) }, { status: 500 });
  }
}
