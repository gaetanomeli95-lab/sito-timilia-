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

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  shippingAddress: string;
  shippingCity?: string;
  shippingZip?: string;
  shippingPhone?: string;
  notes?: string;
  status: string;
}

function orderItemsHtml(items: OrderItem[]): string {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; color: #ccc; font-size: 14px; font-weight: 300;">${item.quantity}x ${item.productName}</td>
        <td style="padding: 10px 0; color: #c8a97e; font-size: 14px; text-align: right; font-weight: 300;">€${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join("");
}

function emailShell(title: string, contentHtml: string): string {
  return `
    <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; background: #111111; border: 1px solid #c8a97e33; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #c8a97e22, #c8a97e08); padding: 32px; text-align: center; border-bottom: 1px solid #c8a97e22;">
        <h1 style="color: #c8a97e; font-size: 24px; letter-spacing: 0.2em; margin: 0; font-weight: 300;">TIMILIA</h1>
        <p style="color: #888; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 8px;">Pizza di Sicilia · Palermo</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #e0e0e0; font-size: 18px; font-weight: 300; margin-bottom: 16px;">${title}</h2>
        ${contentHtml}
      </div>
      <div style="padding: 20px 32px; border-top: 1px solid #222; text-align: center;">
        <p style="color: #555; font-size: 11px; margin: 0;">Via Maqueda 221, 90133 Palermo PA</p>
      </div>
    </div>
  `;
}

export async function sendOrderConfirmationEmail(orderData: OrderEmailData): Promise<boolean> {
  if (!resend) {
    console.log("[DEMO MODE] Would send order confirmation to", orderData.customerEmail);
    return true;
  }

  const statusLabels: Record<string, string> = {
    pending: "In attesa di conferma",
    paid: "Pagamento confermato",
    preparing: "In preparazione",
    shipped: "Spedito",
    delivered: "Consegnato",
  };

  const content = `
    <p style="color: #aaa; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
      Ciao ${orderData.customerName},<br/><br/>
      Abbiamo ricevuto il tuo ordine <strong style="color: #c8a97e;">#${orderData.orderId.slice(0, 8)}</strong>.
    </p>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      ${orderItemsHtml(orderData.items)}
      <tr style="border-top: 1px solid #333;">
        <td style="padding: 12px 0; color: #e0e0e0; font-size: 15px; font-weight: 400;">Totale</td>
        <td style="padding: 12px 0; color: #c8a97e; font-size: 18px; text-align: right; font-weight: 300;">€${orderData.total.toFixed(2)}</td>
      </tr>
    </table>
    <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
      <p style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px;">Spedizione</p>
      <p style="color: #ccc; font-size: 14px; font-weight: 300; margin: 0; line-height: 1.5;">
        ${orderData.shippingAddress}<br/>
        ${orderData.shippingCity ? orderData.shippingCity + " " : ""}${orderData.shippingZip || ""}<br/>
        ${orderData.shippingPhone || ""}
      </p>
    </div>
    <div style="text-align: center; margin: 24px 0;">
      <span style="display: inline-block; padding: 8px 20px; border: 1px solid #c8a97e33; border-radius: 20px; background: #c8a97e0a; color: #c8a97e; font-size: 13px; letter-spacing: 0.1em;">
        ${statusLabels[orderData.status] || orderData.status}
      </span>
    </div>
    <p style="color: #666; font-size: 12px; line-height: 1.5; text-align: center;">
      Ti contatteremo via email per aggiornamenti sul tuo ordine.<br/>
      Grazie per aver scelto TIMILIA.
    </p>
  `;

  try {
    const { error } = await resend.emails.send({
      from: `TIMILIA <${FROM_EMAIL}>`,
      to: orderData.customerEmail,
      subject: `Ordine #${orderData.orderId.slice(0, 8)} — TIMILIA`,
      html: emailShell("Conferma ordine", content),
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

export async function sendOrderNotificationToAdmin(orderData: OrderEmailData): Promise<boolean> {
  if (!resend) {
    console.log("[DEMO MODE] Would send admin notification for order", orderData.orderId);
    return true;
  }

  const adminEmail = process.env.ADMIN_EMAIL || "gaetano.meli95@gmail.com";

  const content = `
    <p style="color: #aaa; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
      Nuovo ordine ricevuto da <strong style="color: #c8a97e;">${orderData.customerName}</strong>
    </p>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      ${orderItemsHtml(orderData.items)}
      <tr style="border-top: 1px solid #333;">
        <td style="padding: 12px 0; color: #e0e0e0; font-size: 15px; font-weight: 400;">Totale</td>
        <td style="padding: 12px 0; color: #c8a97e; font-size: 18px; text-align: right; font-weight: 300;">€${orderData.total.toFixed(2)}</td>
      </tr>
    </table>
    <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
      <p style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px;">Cliente</p>
      <p style="color: #ccc; font-size: 14px; font-weight: 300; margin: 0 0 12px; line-height: 1.5;">
        ${orderData.customerName}<br/>
        ${orderData.customerEmail}<br/>
        ${orderData.shippingPhone || ""}
      </p>
      <p style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px;">Spedizione</p>
      <p style="color: #ccc; font-size: 14px; font-weight: 300; margin: 0; line-height: 1.5;">
        ${orderData.shippingAddress}<br/>
        ${orderData.shippingCity ? orderData.shippingCity + " " : ""}${orderData.shippingZip || ""}
      </p>
      ${orderData.notes ? `<p style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin: 12px 0 8px;">Note</p><p style="color: #ccc; font-size: 14px; font-weight: 300; margin: 0;">${orderData.notes}</p>` : ""}
    </div>
    <p style="color: #666; font-size: 12px; text-align: center;">
      Ordine ID: ${orderData.orderId}
    </p>
  `;

  try {
    const { error } = await resend.emails.send({
      from: `TIMILIA <${FROM_EMAIL}>`,
      to: adminEmail,
      subject: `Nuovo ordine #${orderData.orderId.slice(0, 8)} — ${orderData.customerName}`,
      html: emailShell("Nuovo ordine ricevuto", content),
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

export async function sendOrderStatusUpdateEmail(
  customerEmail: string,
  customerName: string,
  orderId: string,
  newStatus: string,
  trackingNumber?: string
): Promise<boolean> {
  if (!resend) {
    console.log("[DEMO MODE] Would send status update to", customerEmail);
    return true;
  }

  const statusLabels: Record<string, string> = {
    pending: "In attesa di conferma",
    paid: "Pagamento confermato",
    preparing: "In preparazione",
    shipped: "Spedito",
    delivered: "Consegnato",
  };

  const statusMessage: Record<string, string> = {
    pending: "Il tuo ordine è in attesa di conferma.",
    paid: "Abbiamo ricevuto il tuo pagamento. Inizieremo a preparare il tuo ordine a breve.",
    preparing: "Stiamo preparando il tuo ordine con cura.",
    shipped: trackingNumber
      ? `Il tuo ordine è stato spedito! Codice tracking: <strong style="color: #c8a97e;">${trackingNumber}</strong>`
      : "Il tuo ordine è stato spedito! Riceverai il pacco a breve.",
    delivered: "Il tuo ordine è stato consegnato. Grazie per aver scelto TIMILIA!",
  };

  const content = `
    <p style="color: #aaa; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
      Ciao ${customerName},<br/><br/>
      ${statusMessage[newStatus] || "Il tuo ordine è stato aggiornato."}
    </p>
    <div style="text-align: center; margin: 24px 0;">
      <span style="display: inline-block; padding: 8px 20px; border: 1px solid #c8a97e33; border-radius: 20px; background: #c8a97e0a; color: #c8a97e; font-size: 13px; letter-spacing: 0.1em;">
        ${statusLabels[newStatus] || newStatus}
      </span>
    </div>
    <p style="color: #666; font-size: 12px; line-height: 1.5; text-align: center;">
      Ordine #${orderId.slice(0, 8)}<br/>
      Grazie per aver scelto TIMILIA.
    </p>
  `;

  try {
    const { error } = await resend.emails.send({
      from: `TIMILIA <${FROM_EMAIL}>`,
      to: customerEmail,
      subject: `Aggiornamento ordine #${orderId.slice(0, 8)} — TIMILIA`,
      html: emailShell("Stato ordine aggiornato", content),
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
