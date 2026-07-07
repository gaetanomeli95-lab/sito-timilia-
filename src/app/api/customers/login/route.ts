import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e password sono obbligatorie" },
        { status: 400 }
      );
    }

    const customer = await storage.findCustomerByEmail(email);
    if (!customer) {
      return NextResponse.json(
        { error: "Nessun account trovato con questa email" },
        { status: 404 }
      );
    }

    if (!customer.passwordHash) {
      return NextResponse.json(
        { error: "Account non configurato per il login. Registrati di nuovo." },
        { status: 400 }
      );
    }

    const valid = await bcrypt.compare(password, customer.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Password non corretta" },
        { status: 401 }
      );
    }

    if (!customer.verified) {
      return NextResponse.json(
        {
          error: "Account non verificato. Inserisci il codice OTP.",
          needsVerification: true,
          customerId: customer.id,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      customer: { id: customer.id, name: customer.name, email: customer.email },
    });
  } catch {
    return NextResponse.json(
      { error: "Errore durante il login" },
      { status: 500 }
    );
  }
}
