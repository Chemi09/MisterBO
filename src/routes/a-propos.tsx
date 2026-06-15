import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, Heart, Sparkles } from "lucide-react";
import { BRAND } from "@/lib/format";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: `À propos — ${BRAND.name}` },
      { name: "description", content: `${BRAND.name} : savons artisanaux 100% bio fabriqués à Kinshasa. Notre histoire, notre mission, nos engagements.` },
      { property: "og:title", content: `À propos de ${BRAND.name}` },
      { property: "og:description", content: "L'histoire de la marque Savon Mister Bo." },
    ],
  }),
  component: () => (
    <div>
      <section className="bg-hero py-20">
        <div className="container-wide max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">À propos</p>
          <h1 className="mt-2 font-display text-5xl text-primary md:text-6xl">
            La beauté, naturellement révélée.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {BRAND.name} est une marque congolaise dédiée à la beauté authentique. Nos savons Mister Bo,
            fabriqués artisanalement à {BRAND.city}, conjuguent les meilleurs ingrédients de la nature
            — curcuma, riz, huiles végétales — pour révéler la beauté unique de chaque peau.
          </p>
        </div>
      </section>

      <section className="container-wide py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: Leaf, title: "100% bio", text: "Aucun parabène, sulfate ou perturbateur endocrinien. Que des actifs naturels." },
            { icon: Heart, title: "Fait main", text: "Chaque savon est saponifié à froid pour préserver toutes les vertus des ingrédients." },
            { icon: Sparkles, title: "Made in RDC", text: "Une production locale, des emplois locaux, une fierté congolaise." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl bg-card p-8 shadow-soft">
              <Icon className="h-8 w-8 text-accent" />
              <h2 className="mt-4 font-display text-2xl text-primary">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link to="/catalogue" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-warm">
            Découvrir nos savons
          </Link>
        </div>
      </section>
    </div>
  ),
});
