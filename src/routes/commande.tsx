import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Loader2, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { fetchDeliveryZones, validateCoupon, fetchSettings } from "@/lib/queries";
import { formatCDF, whatsappUrl, BRAND } from "@/lib/format";
import { createOrder } from "@/lib/orders.functions";
import { buildInvoicePdf, buildWhatsappMessage } from "@/lib/invoice";

// DELIVERY_FEE now comes from settings (supabase) or falls back to 10000 FC


export const Route = createFileRoute("/commande")({
  head: () => ({
    meta: [
      { title: `Commande — ${BRAND.name}` },
      { name: "description", content: `Finalisez votre commande ${BRAND.name}. Livraison calculée à l'étape suivante.` },
    ],
  }),
  component: CheckoutPage,
});

const schema = z.object({
  customer_name: z.string().trim().min(2, "Nom requis").max(100),
  customer_phone: z.string().trim().regex(/^\+?[0-9 ]{8,15}$/, "Numéro invalide"),
  customer_email: z.string().trim().email("Email invalide").max(255).optional().or(z.literal("")),
  address: z.string().trim().min(5, "Adresse requise").max(300),
  commune: z.string().min(1, "Sélectionnez votre commune"),
  notes: z.string().max(500).optional().or(z.literal("")),
});
type FormData = z.infer<typeof schema>;

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();
  const { data: zones = [] } = useQuery({ queryKey: ["zones"], queryFn: fetchDeliveryZones });
  const submitOrder = useServerFn(createOrder);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: () => fetchSettings() });
  const commune = watch("commune");
  const deliveryFee = settings?.delivery_fee_cdf ?? 10000; // default 10 000 FC
  const total = Math.max(0, subtotal - discount) + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="container-wide py-20 text-center">
        <h1 className="font-display text-3xl text-primary">Votre panier est vide</h1>
        <Link to="/catalogue" className="mt-4 inline-block text-accent">Retour à la boutique</Link>
      </div>
    );
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    const c = await validateCoupon(couponCode.trim());
    if (!c) {
      toast.error("Code promo invalide ou expiré");
      return;
    }
    const d = c.type === "percentage" ? Math.round((subtotal * c.value) / 100) : c.value;
    setDiscount(d);
    setAppliedCoupon(c.code);
    toast.success(`Code ${c.code} appliqué : -${formatCDF(d)}`);
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const result = await submitOrder({
        data: {
          customer_name: data.customer_name,
          customer_phone: data.customer_phone,
          customer_email: data.customer_email || null,
          address: data.address,
          commune: data.commune,
          notes: data.notes || null,
          payment_method: "cod",
          subtotal_cdf: subtotal,
          delivery_fee_cdf: deliveryFee,
          discount_cdf: discount,
          total_cdf: total,
          coupon_code: appliedCoupon,
          items: items.map((it) => ({
            product_id: it.productId,
            product_name: it.name,
            unit_price_cdf: it.price,
            quantity: it.quantity,
          })),
        },
      });

      const invoiceData = {
        orderNumber: result.order_number,
        customerName: data.customer_name,
        customerPhone: data.customer_phone,
        customerEmail: data.customer_email || null,
        address: data.address,
        commune: data.commune,
        items: items.slice(),
        subtotal,
        delivery: deliveryFee,
        discount,
        total,
        couponCode: appliedCoupon,
        date: new Date(),
      };

      // Generate and download PDF invoice
      try {
        const pdf = buildInvoicePdf(invoiceData);
        pdf.save(`Facture-${result.order_number}.pdf`);
      } catch (err) {
        console.error("PDF error:", err);
      }

      // Open WhatsApp with order details
      const msg = buildWhatsappMessage(invoiceData);
      window.open(whatsappUrl(msg), "_blank");

      clear();
      toast.success("Commande enregistrée !");
      navigate({ to: "/commande-confirmee", search: { order: result.order_number } });
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de l'enregistrement. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-wide py-12">
      <h1 className="font-display text-4xl text-primary md:text-5xl">Finaliser la commande</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-xl text-primary">Coordonnées</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Nom complet *" error={errors.customer_name?.message}>
                <input {...register("customer_name")} className="input" placeholder="Marie Mukendi" />
              </Field>
              <Field label="Téléphone *" error={errors.customer_phone?.message}>
                <input {...register("customer_phone")} className="input" placeholder="+243 800 000 000" />
              </Field>
              <Field label="Email (facultatif)" error={errors.customer_email?.message}>
                <input {...register("customer_email")} className="input" placeholder="vous@email.com" type="email" />
              </Field>
              <Field label="Commune *" error={errors.commune?.message}>
                <select {...register("commune")} className="input">
                  <option value="">Sélectionnez</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.commune}>{z.commune}</option>
                  ))}
                </select>
              </Field>
              <Field label="Adresse de livraison *" error={errors.address?.message} full>
                <input {...register("address")} className="input" placeholder="N° avenue, quartier, repère" />
              </Field>
              <Field label="Notes (facultatif)" error={errors.notes?.message} full>
                <textarea {...register("notes")} rows={3} className="input resize-none" placeholder="Instructions de livraison..." />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-xl text-primary">Paiement</h2>
            <p className="mt-2 text-sm text-muted-foreground">Paiement à la livraison (cash). Vous payez à la réception de votre commande.</p>
          </section>
        </div>

        <aside className="sticky top-24 h-fit space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-xl text-primary">Récapitulatif</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {items.map((it) => (
                <li key={it.productId} className="flex items-start gap-3">
                  <img src={it.image} alt="" className="h-12 w-12 rounded-md object-cover" />
                  <div className="flex-1">
                    <p className="font-medium">{it.name}</p>
                    <p className="text-xs text-muted-foreground">x{it.quantity}</p>
                  </div>
                  <span className="text-sm">{formatCDF(it.price * it.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Code promo"
                className="input flex-1 uppercase"
                disabled={!!appliedCoupon}
              />
              <button type="button" onClick={applyCoupon} disabled={!!appliedCoupon} className="rounded-full bg-secondary px-4 text-sm font-medium text-primary disabled:opacity-50">
                {appliedCoupon ? "Appliqué" : "Appliquer"}
              </button>
            </div>

            <dl className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
              <Row label="Sous-total" value={formatCDF(subtotal)} />
              {discount > 0 && <Row label={`Remise (${appliedCoupon})`} value={`-${formatCDF(discount)}`} accent />}
              <Row label="Livraison (partout)" value={formatCDF(deliveryFee)} />
            </dl>
            <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
              <span className="font-display text-lg text-primary">Total</span>
              <span className="font-display text-2xl">{formatCDF(total)}</span>
            </div>

            <button
              type="submit"
              disabled={submitting || !commune}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-warm disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Envoi..." : "Confirmer la commande"}
            </button>
            <p className="mt-3 text-xs text-muted-foreground"><ShieldCheck className="mr-1 inline h-3.5 w-3.5" /> Vos données sont protégées.</p>
            <p className="mt-1 text-xs text-muted-foreground"><Truck className="mr-1 inline h-3.5 w-3.5" /> Livraison sous 24–72h.</p>
          </div>
        </aside>
      </form>

      <style>{`.input{width:100%;border-radius:0.75rem;border:1px solid var(--color-border);background:var(--color-card);padding:0.625rem 0.875rem;font-size:0.875rem;outline:none;transition:border-color .15s}.input:focus{border-color:var(--color-ring);box-shadow:0 0 0 2px color-mix(in oklch,var(--color-ring) 30%,transparent)}`}</style>
    </div>
  );
}

function Field({ label, error, children, full }: { label: string; error?: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={full ? "sm:col-span-2" : ""}>
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={accent ? "font-medium text-accent" : "font-medium"}>{value}</dd>
    </div>
  );
}
