import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getAuthenticatedUser } from "@/lib/server-auth";

async function getCustomerId(request: NextRequest): Promise<string | null> {
  const user = await getAuthenticatedUser(request);
  if (!user) return null;

  const { data } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("auth_id", user.id)
    .limit(1);

  return data?.[0]?.id || null;
}

export async function GET(request: NextRequest) {
  try {
    const customerId = await getCustomerId(request);
    if (!customerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ reviews: data || [] });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const customerId = await getCustomerId(request);
    if (!customerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing review id" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("reviews")
      .delete()
      .eq("id", id)
      .eq("customer_id", customerId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
