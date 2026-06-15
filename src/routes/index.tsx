import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Leaf, Sparkles, ShieldCheck, Heart, Star, MessageCircle } from "lucide-react";
import { fetchProducts, fetchReviews } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { BRAND, whatsappUrl } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HB Cosmétique — Savon Mister Bo 100% Bio | Kinshasa RDC" },
      { name: "description", content: "Découvrez Savon Mister Bo : nos savons artisanaux bio au curcuma et au riz pour une peau éclatante. Fabriqués à Kinshasa. Livraison RDC." },
      { property: "og:title", content: "HB Cosmétique — Savon Mister Bo 100% Bio" },
      { property: "og:description", content: "Un trésor pour la beauté de votre peau." },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: () => fetchProducts() });
  const { data: reviews = [] } = useQuery({ queryKey: ["reviews"], queryFn: () => fetchReviews() });
  const featured = products.find((p) => p.category === "pack") ?? products[0];

  return (
    <div>
      {/* HERO */}
      <section className="bg-hero relative overflow-hidden">
        <div className="container-wide grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-leaf-soft bg-cream/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Leaf className="h-3.5 w-3.5" /> {BRAND.tagline} · Fabriqué à Kinshasa
            </span>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] text-primary text-balance md:text-7xl">
              Un trésor pour <em className="italic text-accent">la beauté</em> de votre peau.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              Savon Mister Bo — la routine bio matin & soir au riz et au curcuma. Une peau plus claire,
              unifiée et lumineuse, en toute douceur.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/catalogue"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-warm transition-transform hover:-translate-y-0.5"
              >
                Acheter maintenant <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={whatsappUrl("Bonjour HB Cosmétique, je suis intéressé(e) par vos savons Mister Bo.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-7 py-3.5 text-sm font-semibold text-primary hover:bg-secondary"
              >
                <MessageCircle className="h-4 w-4" /> Commander sur WhatsApp
              </a>
            </div>
            <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> 100% naturel</span>
              <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-accent" /> Résultats visibles</span>
              <span className="flex items-center gap-1.5"><Heart className="h-4 w-4 text-curcuma" /> Fait main</span>
            </div>
          </div>

          {featured && (
            <div className="relative">
              <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-curcuma/20 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-leaf-soft blur-3xl" />
              <div className="relative animate-float overflow-hidden rounded-3xl border border-border/60 bg-card shadow-warm">
                <img src={featured.image_url} alt={featured.name} className="aspect-[4/5] w-full object-cover" />
              </div>
              <span className="absolute -left-2 top-6 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground shadow-warm">
                Best-seller
              </span>
            </div>
          )}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="container-wide py-20" id="produits">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Notre gamme</p>
            <h2 className="mt-2 font-display text-4xl text-primary md:text-5xl">Savons signature</h2>
          </div>
          <Link to="/catalogue" className="hidden text-sm font-medium text-primary hover:text-accent md:inline">
            Voir tout →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* WHY */}
      <section className="bg-cream py-20">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Pourquoi nous choisir</p>
            <h2 className="mt-2 font-display text-4xl text-primary md:text-5xl">La nature, sans compromis.</h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              { icon: Leaf, title: "100% Bio & naturel", text: "Curcuma, riz, huiles végétales. Aucun parabène, aucun sulfate, aucun perturbateur." },
              { icon: Sparkles, title: "Résultats visibles", text: "Teint unifié, peau éclaircie et imperfections atténuées en quelques semaines." },
              { icon: Heart, title: "Fait à Kinshasa", text: "Une production artisanale congolaise, pensée pour les peaux africaines." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl bg-card p-8 shadow-soft">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-leaf-gradient text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-xl text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      {reviews.length > 0 && (
        <section className="container-wide py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Avis clients</p>
            <h2 className="mt-2 font-display text-4xl text-primary md:text-5xl">Elles en parlent mieux que nous.</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reviews.slice(0, 3).map((r) => (
              <figure key={r.id} className="rounded-2xl border border-border/60 bg-card p-7 shadow-soft">
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <blockquote className="mt-4 font-display text-lg leading-snug text-foreground">"{r.comment}"</blockquote>
                <figcaption className="mt-4 text-sm font-medium text-muted-foreground">— {r.author_name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="bg-cream py-20">
        <div className="container-wide max-w-3xl">
          <h2 className="font-display text-4xl text-primary md:text-5xl">Questions fréquentes</h2>
          <div className="mt-10 space-y-4">
            {[
              { q: "Comment utiliser la gamme Mister Bo ?", a: "Le matin, lavez-vous avec le savon à base de riz. Le soir, après une journée exposée au soleil et à la poussière, utilisez le savon au curcuma pour votre bain." },
              { q: "Vos savons sont-ils vraiment 100% bio ?", a: "Oui. Curcuma bio, extrait de riz, huiles végétales et glycérine naturelle. Aucun parabène, aucun sulfate." },
              { q: "Livrez-vous dans toutes les communes de Kinshasa ?", a: "Oui, nous livrons dans les 24 communes de Kinshasa. Les frais sont calculés automatiquement à la commande." },
              { q: "Quels sont les modes de paiement ?", a: "Paiement à la livraison, Airtel Money, Orange Money et M-Pesa." },
            ].map((f) => (
              <details key={f.q} className="group rounded-xl border border-border/60 bg-card p-5 open:shadow-soft">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-primary">
                  {f.q}
                  <span className="text-accent transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-wide py-20">
        <div className="overflow-hidden rounded-3xl bg-leaf-gradient p-10 text-center text-primary-foreground md:p-16">
          <h2 className="mx-auto max-w-2xl font-display text-3xl md:text-5xl">Offrez à votre peau le rituel qu'elle mérite.</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">Recevez votre Pack Duo Mister Bo dans toute la RDC.</p>
          <Link to="/catalogue" className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-warm hover:opacity-95">
            Commander mon pack <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
