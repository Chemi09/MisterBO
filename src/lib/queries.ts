import { supabase } from "@/integrations/supabase/client";

export async function fetchProducts(filters?: { category?: string }) {
  let q = supabase.from("products").select("*").eq("is_active", true).order("sort_order");
  if (filters?.category && filters.category !== "all") {
    q = q.eq("category", filters.category as "curcuma" | "riz" | "pack");
  }
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function fetchProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchDeliveryZones() {
  const { data, error } = await supabase
    .from("delivery_zones")
    .select("*")
    .eq("is_active", true)
    .order("commune");
  if (error) throw error;
  return data;
}

export async function fetchReviews(productId?: string) {
  let q = supabase.from("reviews").select("*").eq("is_published", true).order("created_at", { ascending: false });
  if (productId) q = q.eq("product_id", productId);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function validateCoupon(code: string) {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  if (data.expires_at && new Date(data.expires_at) < new Date()) return null;
  if (data.max_uses && data.used_count >= data.max_uses) return null;
  return data;
}

export type Product = Awaited<ReturnType<typeof fetchProducts>>[number];
export type DeliveryZone = Awaited<ReturnType<typeof fetchDeliveryZones>>[number];
