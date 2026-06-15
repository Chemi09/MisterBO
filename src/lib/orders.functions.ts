import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const itemSchema = z.object({
  product_id: z.string().uuid(),
  product_name: z.string().min(1).max(200),
  unit_price_cdf: z.number().int().nonnegative(),
  quantity: z.number().int().positive(),
});

const orderSchema = z.object({
  customer_name: z.string().trim().min(2).max(100),
  customer_phone: z.string().trim().min(8).max(20),
  customer_email: z.string().trim().email().max(255).nullable().optional(),
  address: z.string().trim().min(5).max(300),
  commune: z.string().min(1).max(100),
  notes: z.string().max(500).nullable().optional(),
  payment_method: z.enum(["cod"]),
  subtotal_cdf: z.number().int().nonnegative(),
  delivery_fee_cdf: z.number().int().nonnegative(),
  discount_cdf: z.number().int().nonnegative(),
  total_cdf: z.number().int().nonnegative(),
  coupon_code: z.string().max(50).nullable().optional(),
  items: z.array(itemSchema).min(1).max(50),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { items, ...orderData } = data;

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert(orderData)
      .select("id, order_number")
      .single();
    if (error || !order) throw new Error(error?.message ?? "Erreur création commande");

    const itemsPayload = items.map((it) => ({
      order_id: order.id,
      product_id: it.product_id,
      product_name: it.product_name,
      unit_price_cdf: it.unit_price_cdf,
      quantity: it.quantity,
      line_total_cdf: it.unit_price_cdf * it.quantity,
    }));
    const { error: itemsErr } = await supabaseAdmin.from("order_items").insert(itemsPayload);
    if (itemsErr) {
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      throw new Error(itemsErr.message);
    }

    return { id: order.id, order_number: order.order_number };
  });
