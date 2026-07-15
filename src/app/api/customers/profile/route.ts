import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const authId = request.nextUrl.searchParams.get("authId");
    if (!authId) {
      return NextResponse.json({ error: "Missing auth id" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("auth_id", authId);

    if (error || !data || data.length === 0) {
      return NextResponse.json({ error: "Profile not found", details: error?.message, authId }, { status: 404 });
    }

    return NextResponse.json({ profile: data[0] });
  } catch (e) {
    return NextResponse.json({ error: "Server error", details: String(e) }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { authId, avatar_url } = body;

    if (!authId) {
      return NextResponse.json({ error: "Missing auth id" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("customers")
      .update({ avatar_url })
      .eq("auth_id", authId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error", details: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authId = request.nextUrl.searchParams.get("authId");
    if (!authId) {
      return NextResponse.json({ error: "Missing auth id" }, { status: 400 });
    }

    const { error: customerError } = await supabaseAdmin
      .from("customers")
      .delete()
      .eq("auth_id", authId);

    if (customerError) {
      return NextResponse.json({ error: customerError.message }, { status: 500 });
    }

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(authId);

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error", details: String(e) }, { status: 500 });
  }
}
