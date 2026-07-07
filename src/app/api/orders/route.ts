import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  items: OrderItem[];
  total: number;
  notes?: string;
  status: "pending";
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // dir already exists
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, shippingAddress, items, notes } = body;

    if (!customerName || !customerEmail || !shippingAddress || !items?.length) {
      return NextResponse.json(
        { error: "Nome, email, indirizzo e articoli sono obbligatori" },
        { status: 400 }
      );
    }

    const total = items.reduce(
      (sum: number, item: OrderItem) => sum + item.price * item.quantity,
      0
    );

    const order: Order = {
      id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      customerName,
      customerEmail,
      customerPhone: customerPhone || undefined,
      shippingAddress,
      items,
      total,
      notes: notes || undefined,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await ensureDataDir();
    const filepath = path.join(DATA_DIR, "orders.json");
    let orders: Order[] = [];
    try {
      const content = await fs.readFile(filepath, "utf-8");
      orders = JSON.parse(content);
    } catch {
      // first order
    }
    orders.push(order);
    await fs.writeFile(filepath, JSON.stringify(orders, null, 2), "utf-8");

    return NextResponse.json(
      { success: true, message: "Ordine ricevuto! Ti contatteremo per la conferma.", order },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Errore durante l'elaborazione dell'ordine" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await ensureDataDir();
    const filepath = path.join(DATA_DIR, "orders.json");
    const content = await fs.readFile(filepath, "utf-8");
    const orders = JSON.parse(content);
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ orders: [] });
  }
}
