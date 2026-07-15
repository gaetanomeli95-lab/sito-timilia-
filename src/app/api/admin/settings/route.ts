import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

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
