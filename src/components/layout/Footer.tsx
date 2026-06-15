import { Link } from "@tanstack/react-router";
import { Phone, Instagram, MapPin } from "lucide-react";
import { BRAND, whatsappUrl } from "@/lib/format";

export function Footer() {
  return (
    <footer className="mt-24 bg-leaf-gradient text-primary-foreground">
      <div className="container-wide grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-cream/15 font-display text-lg backdrop-blur">HB</span>
            <div>
              <p className="font-display text-xl">{BRAND.name}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-primary-foreground/70">{BRAND.tagline}</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-primary-foreground/75">
            Savons artisanaux 100% bio fabriqués à {BRAND.city}. Un trésor pour la beauté de votre peau,
            inspiré du meilleur de la nature.
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary-foreground/60">Boutique</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/catalogue" className="hover:text-accent">Tous les savons</Link></li>
            <li><Link to="/catalogue" search={{ category: "curcuma" }} className="hover:text-accent">Curcuma</Link></li>
            <li><Link to="/catalogue" search={{ category: "riz" }} className="hover:text-accent">Riz</Link></li>
            <li><Link to="/catalogue" search={{ category: "pack" }} className="hover:text-accent">Pack Duo</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary-foreground/60">Contact</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {BRAND.city}, {BRAND.country}</li>
            <li><a href={whatsappUrl("Bonjour HB Cosmétique")} className="flex items-center gap-2 hover:text-accent"><Phone className="h-4 w-4" /> {BRAND.phone}</a></li>
            <li className="flex items-center gap-2"><Instagram className="h-4 w-4" /> @{BRAND.instagram}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-wide flex flex-col items-center justify-between gap-2 py-5 text-xs text-primary-foreground/60 md:flex-row">
          <p>© {new Date().getFullYear()} {BRAND.name}. Tous droits réservés.</p>
          <p>Fabriqué avec ❤ à Kinshasa, RDC</p>
        </div>
      </div>
    </footer>
  );
}
