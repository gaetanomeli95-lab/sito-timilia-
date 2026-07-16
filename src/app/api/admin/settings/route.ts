import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdmin, rateLimit } from "@/lib/server-auth";

export async function GET(request: NextRequest) {
  try {
    if (!rateLimit(request, 30, 60_000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    if (!await verifyAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data } = await supabaseAdmin
      .from("settings")
      .select("key, value")
      .eq("key", "maintenance_mode")
      .single();

    return NextResponse.json({ maintenance_mode: data?.value === "true" });
  } catch {
    return NextResponse.json({ maintenance_mode: false });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!rateLimit(request, 10, 60_000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    if (!await verifyAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const enabled = body.enabled === true;

    const { error } = await supabaseAdmin
      .from("settings")
      .upsert({ key: "maintenance_mode", value: enabled ? "true" : "false" }, { onConflict: "key" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, maintenance_mode: enabled });
  } catch (e) {
    return NextResponse.json({ error: "Server error", details: String(e) }, { status: 500 });
  }
}
