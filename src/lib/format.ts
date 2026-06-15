export function formatCDF(amount: number): string {
  return new Intl.NumberFormat("fr-CD", { maximumFractionDigits: 0 }).format(amount) + " FC";
}

export const WHATSAPP_NUMBER = "243817581034";
export const BRAND = {
  name: "MISTER BO SAVONS NATURELS",
  product: "Savon Mister Bo",
  tagline: "100% BIO",
  phone: "+243 817 581 034",
  whatsapp: WHATSAPP_NUMBER,
  instagram: "misterbo_savons",
  city: "Kinshasa",
  country: "République Démocratique du Congo",
};

export function whatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
