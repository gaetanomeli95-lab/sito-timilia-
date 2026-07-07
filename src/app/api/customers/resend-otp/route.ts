import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { generateOTP, sendOTPEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json(
        { error: "ID cliente obbligatorio" },
        { status: 400 }
      );
    }

    const customer = await storage.findCustomerById(customerId);
    if (!customer) {
      return NextResponse.json(
        { error: "Cliente non trovato" },
        { status: 404 }
      );
    }

    const otpCode = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await storage.updateCustomer(customerId, { otpCode, otpExpires });

    const emailSent = await sendOTPEmail(customer.email, otpCode, customer.name);

    return NextResponse.json({
      success: true,
      message: "Nuovo codice OTP inviato via email",
      emailSent,
      ...(process.env.NODE_ENV === "development" && !emailSent ? { debugOtp: otpCode } : {}),
    });
  } catch {
    return NextResponse.json(
      { error: "Errore durante l'invio del codice" },
      { status: 500 }
    );
  }
}
