import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Endpoint sostituito dal checkout sicuro Stripe" },
    { status: 410 }
  );
}

export async function GET() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
