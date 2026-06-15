import { jsPDF } from "jspdf";
import { formatCDF, BRAND } from "./format";
import type { CartItem } from "./cart";

export type InvoiceData = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  address: string;
  commune: string;
  items: CartItem[];
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  couponCode?: string | null;
  date: Date;
};

export function buildInvoicePdf(d: InvoiceData): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  let y = 18;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(33, 102, 65);
  doc.text(BRAND.name, 15, y);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  y += 6;
  doc.text(`${BRAND.product} — ${BRAND.tagline}`, 15, y);
  y += 5;
  doc.text(`${BRAND.city}, ${BRAND.country}`, 15, y);
  y += 5;
  doc.text(`Tél / WhatsApp : ${BRAND.phone}`, 15, y);

  // Invoice title (right)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(33, 102, 65);
  doc.text("FACTURE", W - 15, 20, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`N° ${d.orderNumber}`, W - 15, 27, { align: "right" });
  doc.text(d.date.toLocaleDateString("fr-FR"), W - 15, 33, { align: "right" });

  y = 50;
  doc.setDrawColor(220, 200, 150);
  doc.line(15, y, W - 15, y);

  // Customer
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.text("Client", 15, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  y += 5;
  doc.text(d.customerName, 15, y);
  y += 5;
  doc.text(d.customerPhone, 15, y);
  if (d.customerEmail) { y += 5; doc.text(d.customerEmail, 15, y); }
  y += 5;
  doc.text(`${d.address} — ${d.commune}`, 15, y, { maxWidth: 180 });

  // Items table
  y += 12;
  doc.setFillColor(33, 102, 65);
  doc.rect(15, y - 5, W - 30, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Produit", 18, y);
  doc.text("Qté", 130, y, { align: "right" });
  doc.text("PU", 155, y, { align: "right" });
  doc.text("Total", W - 18, y, { align: "right" });

  doc.setTextColor(40, 40, 40);
  doc.setFont("helvetica", "normal");
  y += 8;
  for (const it of d.items) {
    doc.text(it.name, 18, y, { maxWidth: 100 });
    doc.text(String(it.quantity), 130, y, { align: "right" });
    doc.text(formatCDF(it.price), 155, y, { align: "right" });
    doc.text(formatCDF(it.price * it.quantity), W - 18, y, { align: "right" });
    y += 7;
    doc.setDrawColor(235, 235, 235);
    doc.line(15, y - 3, W - 15, y - 3);
  }

  // Totals
  y += 4;
  const labelX = 130;
  const valueX = W - 18;
  doc.setFontSize(10);
  doc.text("Sous-total", labelX, y, { align: "right" });
  doc.text(formatCDF(d.subtotal), valueX, y, { align: "right" }); y += 6;
  if (d.discount > 0) {
    doc.text(`Remise${d.couponCode ? ` (${d.couponCode})` : ""}`, labelX, y, { align: "right" });
    doc.text(`-${formatCDF(d.discount)}`, valueX, y, { align: "right" }); y += 6;
  }
  doc.text("Livraison", labelX, y, { align: "right" });
  doc.text(formatCDF(d.delivery), valueX, y, { align: "right" }); y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(33, 102, 65);
  doc.text("TOTAL", labelX, y, { align: "right" });
  doc.text(formatCDF(d.total), valueX, y, { align: "right" });

  // Payment & footer
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text("Mode de paiement : Paiement à la livraison (cash)", 15, y);
  y += 6;
  doc.text("Livraison sous 24–72h à Kinshasa.", 15, y);

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`Merci pour votre confiance — ${BRAND.name}`, W / 2, 285, { align: "center" });

  return doc;
}

export function buildWhatsappMessage(d: InvoiceData): string {
  const lines = [
    `🌿 *Nouvelle commande ${BRAND.name}*`,
    `N° : *${d.orderNumber}*`,
    ``,
    `👤 ${d.customerName}`,
    `📞 ${d.customerPhone}`,
    `📍 ${d.address}, ${d.commune}`,
    ``,
    `🛒 *Produits :*`,
    ...d.items.map((it) => `• ${it.name} x${it.quantity} — ${formatCDF(it.price * it.quantity)}`),
    ``,
    `Sous-total : ${formatCDF(d.subtotal)}`,
    ...(d.discount > 0 ? [`Remise : -${formatCDF(d.discount)}`] : []),
    `Livraison : ${formatCDF(d.delivery)}`,
    `*Total : ${formatCDF(d.total)}*`,
    ``,
    `💵 Paiement à la livraison`,
  ];
  return lines.join("\n");
}
