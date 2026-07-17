import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getAuthenticatedUser } from "@/lib/server-auth";

async function getCustomerId(user: { id: string }) {
  const { data } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("auth_id", user.id)
    .limit(1);
  return data?.[0]?.id as string | undefined;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerId = await getCustomerId(user);
    if (!customerId) {
      return NextResponse.json({ favorites: [] });
    }

    const { data, error } = await supabaseAdmin
      .from("customers")
      .select("favorites")
      .eq("id", customerId)
      .limit(1);

    if (error) {
      return NextResponse.json({ error: "Errore del server" }, { status: 500 });
    }

    const favorites = (data?.[0]?.favorites as string[]) || [];
    return NextResponse.json({ favorites });
  } catch {
    return NextResponse.json({ error: "Errore del server" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerId = await getCustomerId(user);
    if (!customerId) {
      return NextResponse.json({ error: "Profilo cliente non trovato" }, { status: 404 });
    }

    const body = await request.json();
    const { itemName, action } = body as { itemName: string; action: "add" | "remove" };

    if (!itemName || !action) {
      return NextResponse.json({ error: "Parametri mancanti" }, { status: 400 });
    }

    const { data: current } = await supabaseAdmin
      .from("customers")
      .select("favorites")
      .eq("id", customerId)
      .limit(1);

    const currentFavorites = (current?.[0]?.favorites as string[]) || [];

    let newFavorites: string[];
    if (action === "add") {
      if (currentFavorites.includes(itemName)) {
        newFavorites = currentFavorites;
      } else {
        newFavorites = [...currentFavorites, itemName];
      }
    } else {
      newFavorites = currentFavorites.filter((n) => n !== itemName);
    }

    const { error } = await supabaseAdmin
      .from("customers")
      .update({ favorites: newFavorites })
      .eq("id", customerId);

    if (error) {
      return NextResponse.json({ error: "Errore durante il salvataggio" }, { status: 500 });
    }

    return NextResponse.json({ favorites: newFavorites });
  } catch {
    return NextResponse.json({ error: "Errore del server" }, { status: 500 });
  }
}
