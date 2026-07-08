import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTPEmail(toEmail: string, otpCode: string, customerName: string): Promise<boolean> {
  // If Resend is not configured, return true (simulate success for demo mode)
  if (!resend) {
    console.log("[DEMO MODE] Email sending disabled - Resend API key not configured");
    console.log(`[DEMO MODE] Would send OTP ${otpCode} to ${toEmail}`);
    return true;
  }

  try {
    const { error } = await resend.emails.send({
      from: `TIMILIA <${FROM_EMAIL}>`,
      to: toEmail,
      subject: "Il tuo codice di verifica TIMILIA",
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; background: #111111; border: 1px solid #c8a97e33; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #c8a97e22, #c8a97e08); padding: 32px; text-align: center; border-bottom: 1px solid #c8a97e22;">
            <h1 style="color: #c8a97e; font-size: 24px; letter-spacing: 0.2em; margin: 0; font-weight: 300;">TIMILIA</h1>
            <p style="color: #888; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 8px;">Pizza di Sicilia · Palermo</p>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #e0e0e0; font-size: 18px; font-weight: 300; margin-bottom: 16px;">Verifica il tuo account</h2>
            <p style="color: #aaa; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
              Ciao ${customerName},<br/><br/>
              Benvenuto nella famiglia TIMILIA. Usa questo codice per verificare la tua registrazione:
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <div style="display: inline-block; font-size: 36px; letter-spacing: 0.3em; color: #c8a97e; font-weight: 300; padding: 16px 32px; border: 1px solid #c8a97e33; border-radius: 12px; background: #c8a97e0a;">
                ${otpCode}
              </div>
            </div>
            <p style="color: #666; font-size: 12px; line-height: 1.5; text-align: center;">
              Il codice scade tra 10 minuti.<br/>
              Se non hai richiesto questa registrazione, ignora questa email.
            </p>
          </div>
          <div style="padding: 20px 32px; border-top: 1px solid #222; text-align: center;">
            <p style="color: #555; font-size: 11px; margin: 0;">Via Maqueda 221, 90133 Palermo PA</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Email send error:", err);
    return false;
  }
}
