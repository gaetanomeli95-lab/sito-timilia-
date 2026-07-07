import { NextRequest, NextResponse } from "next/server";
import { storage, Customer } from "@/lib/storage";
import { generateOTP, sendOTPEmail } from "@/lib/email";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password, newsletterConsent } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nome, email e password sono obbligatori" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La password deve avere almeno 6 caratteri" },
        { status: 400 }
      );
    }

    const existing = await storage.findCustomerByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "Un account con questa email esiste già" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const otpCode = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const customer: Customer = {
      id: `cust_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      email,
      phone: phone || undefined,
      passwordHash,
      newsletterConsent: !!newsletterConsent,
      verified: false,
      otpCode,
      otpExpires,
      createdAt: new Date().toISOString(),
    };

    await storage.addCustomer(customer);

    if (newsletterConsent) {
      await storage.addSubscriber({
        id: `sub_${Date.now()}`,
        email,
        name,
        createdAt: new Date().toISOString(),
      });
    }

    const emailSent = await sendOTPEmail(email, otpCode, name);

    return NextResponse.json(
      {
        success: true,
        message: "Registrazione creata. Inserisci il codice OTP ricevuto via email.",
        customerId: customer.id,
        emailSent,
        ...(process.env.NODE_ENV === "development" && !emailSent ? { debugOtp: otpCode } : {}),
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Errore durante la registrazione" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const customers = await storage.getCustomers();
    const safe = customers.map(({ passwordHash, otpCode, otpExpires, ...rest }) => rest);
    return NextResponse.json({ customers: safe });
  } catch {
    return NextResponse.json(
      { error: "Errore nel recupero clienti" },
      { status: 500 }
    );
  }
}
