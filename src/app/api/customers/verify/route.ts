import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Verifica gestita lato client tramite Supabase Auth" },
    { status: 200 }
  );
}
