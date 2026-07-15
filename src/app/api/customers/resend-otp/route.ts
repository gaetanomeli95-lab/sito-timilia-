import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Reinvio OTP gestito lato client tramite Supabase Auth" },
    { status: 200 }
  );
}
