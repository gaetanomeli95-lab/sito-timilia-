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

    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
    const limit = 50;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabaseAdmin
      .from("customers")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ customers: data, totalPages: count ? Math.ceil(count / limit) : 1, page });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
