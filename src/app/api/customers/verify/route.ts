import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const { customerId, otpCode } = await request.json();

    if (!customerId || !otpCode) {
      return NextResponse.json(
        { error: "ID cliente e codice OTP sono obbligatori" },
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

    if (customer.verified) {
      return NextResponse.json(
        { error: "Account già verificato" },
        { status: 400 }
      );
    }

    if (!customer.otpCode || !customer.otpExpires) {
      return NextResponse.json(
        { error: "Nessun codice OTP trovato. Richiedi un nuovo codice." },
        { status: 400 }
      );
    }

    if (new Date() > new Date(customer.otpExpires)) {
      return NextResponse.json(
        { error: "Il codice OTP è scaduto. Richiedi un nuovo codice." },
        { status: 400 }
      );
    }

    if (customer.otpCode !== otpCode) {
      return NextResponse.json(
        { error: "Codice OTP non corretto" },
        { status: 400 }
      );
    }

    const updated = await storage.updateCustomer(customerId, {
      verified: true,
      otpCode: undefined,
      otpExpires: undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Errore durante la verifica" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Account verificato con successo!",
      customer: { id: updated.id, name: updated.name, email: updated.email },
    });
  } catch {
    return NextResponse.json(
      { error: "Errore durante la verifica" },
      { status: 500 }
    );
  }
}
