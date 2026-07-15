import { teraProducts } from "@/data/teraProducts";

export const SHIPPING_FREE_THRESHOLD = 50;
export const SHIPPING_BASE_COST = 5.9;
export const MAX_ITEM_QUANTITY = 20;

export const VALID_COUPONS: Record<
  string,
  { discount: number; type: "percent" | "fixed"; label: string }
> = {};

export interface CommerceItemInput {
  productId: string;
  quantity: number;
}

export interface CalculatedOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export function calculateOrder(items: CommerceItemInput[], couponCode?: string | null) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Il carrello è vuoto");
  }

  const normalizedItems: CalculatedOrderItem[] = items.map((item) => {
    const product = teraProducts.find((entry) => entry.id === item.productId);
    const quantity = Number(item.quantity);

    if (!product) throw new Error("Prodotto non valido");
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_ITEM_QUANTITY) {
      throw new Error(`La quantità deve essere compresa tra 1 e ${MAX_ITEM_QUANTITY}`);
    }

    return {
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.price,
    };
  });

  const subtotal = normalizedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const normalizedCouponCode = couponCode?.trim().toUpperCase() || null;
  const coupon = normalizedCouponCode ? VALID_COUPONS[normalizedCouponCode] : null;
  const couponDiscount = coupon
    ? coupon.type === "percent"
      ? (subtotal * coupon.discount) / 100
      : Math.min(coupon.discount, subtotal)
    : 0;
  const shippingCost = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_BASE_COST;
  const total = Math.max(0, subtotal - couponDiscount) + shippingCost;

  return {
    items: normalizedItems,
    subtotal: Number(subtotal.toFixed(2)),
    shippingCost: Number(shippingCost.toFixed(2)),
    couponCode: coupon ? normalizedCouponCode : null,
    couponDiscount: Number(couponDiscount.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}
