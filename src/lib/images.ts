export const IMAGES = {
  logo: "/images/logo.png",
  riz: "/images/riz.jpg",
  curcuma: "/images/curcuma.jpg",
  cafe: "/images/cafe.jpg",
  pack: "/images/pack.jpg",
};

export function imageForProduct(product: any): string {
  if (!product) return IMAGES.logo;
  if (product.image_url) return product.image_url;
  const slug = (product.slug || "").toLowerCase();
  const cat = (product.category || "").toLowerCase();
  if (cat === "riz" || slug.includes("riz")) return IMAGES.riz;
  if (cat === "curcuma" || slug.includes("curcuma")) return IMAGES.curcuma;
  if (cat.includes("cafe") || slug.includes("cafe")) return IMAGES.cafe;
  if (cat === "pack" || slug.includes("pack")) return IMAGES.pack;
  return IMAGES.logo;
}
