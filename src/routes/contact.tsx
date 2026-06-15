import { createFileRoute } from "@tanstack/react-router";
import { Phone, Instagram, MapPin, MessageCircle } from "lucide-react";
import { BRAND, whatsappUrl } from "@/lib/format";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — HB Cosmétique" },
      { name: "description", content: "Contactez HB Cosmétique à Kinshasa par téléphone, WhatsApp ou Instagram." },
      { property: "og:title", content: "Contact HB Cosmétique" },
      { property: "og:description", content: "Une question ? Écrivez-nous." },
    ],
  }),
  component: () => (
    <div className="container-wide py-16 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Contact</p>
        <h1 className="mt-2 font-display text-5xl text-primary md:text-6xl">Parlons-nous.</h1>
        <p className="mt-4 text-muted-foreground">
          Une question sur nos savons, votre commande, ou une suggestion ? Notre équipe est là pour vous.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
        <a href={whatsappUrl("Bonjour HB Cosmétique")} target="_blank" rel="noreferrer" className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-warm">
          <MessageCircle className="h-7 w-7 text-accent" />
          <h2 className="mt-4 font-display text-xl text-primary">WhatsApp</h2>
          <p className="mt-1 text-sm text-muted-foreground">{BRAND.phone}</p>
          <p className="mt-2 text-xs text-accent group-hover:underline">Démarrer une conversation →</p>
        </a>
        <a href={`tel:${BRAND.whatsapp}`} className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-warm">
          <Phone className="h-7 w-7 text-accent" />
          <h2 className="mt-4 font-display text-xl text-primary">Téléphone</h2>
          <p className="mt-1 text-sm text-muted-foreground">{BRAND.phone}</p>
        </a>
        <a href={`https://instagram.com/${BRAND.instagram}`} target="_blank" rel="noreferrer" className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-warm">
          <Instagram className="h-7 w-7 text-accent" />
          <h2 className="mt-4 font-display text-xl text-primary">Instagram</h2>
          <p className="mt-1 text-sm text-muted-foreground">@{BRAND.instagram}</p>
        </a>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <MapPin className="h-7 w-7 text-accent" />
          <h2 className="mt-4 font-display text-xl text-primary">Adresse</h2>
          <p className="mt-1 text-sm text-muted-foreground">{BRAND.city}, {BRAND.country}</p>
        </div>
      </div>
    </div>
  ),
});
