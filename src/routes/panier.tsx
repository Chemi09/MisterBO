import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatCDF, BRAND } from "@/lib/format";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: `Mon panier — ${BRAND.name}` },
      { name: "description", content: `Récapitulatif de votre panier ${BRAND.name} avant commande.` },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQty, remove } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-wide py-20">
        <div className="mx-auto max-w-md rounded-3xl border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-cream text-primary">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h1 className="font-display text-2xl text-primary">Votre panier est vide</h1>
          <p className="mt-2 text-sm text-muted-foreground">Découvrez la gamme Savon Mister Bo.</p>
          <Link to="/catalogue" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
            Voir la boutique <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-wide py-12">
      <h1 className="font-display text-4xl text-primary md:text-5xl">Mon panier</h1>
      <p className="mt-2 text-sm text-muted-foreground">{items.length} article(s)</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        <ul className="space-y-4">
          {items.map((it) => (
            <li key={it.productId} className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <Link to="/produits/$slug" params={{ slug: it.slug }} className="shrink-0">
                <img src={it.image} alt={it.name} className="h-28 w-28 rounded-xl object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link to="/produits/$slug" params={{ slug: it.slug }} className="font-display text-lg text-primary hover:text-accent">
                  {it.name}
                </Link>
                <p className="text-sm text-muted-foreground">{formatCDF(it.price)} l'unité</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-border">
                    <button onClick={() => setQty(it.productId, it.quantity - 1)} className="grid h-9 w-9 place-items-center text-primary hover:bg-secondary rounded-l-full" aria-label="Diminuer">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{it.quantity}</span>
                    <button onClick={() => setQty(it.productId, it.quantity + 1)} className="grid h-9 w-9 place-items-center text-primary hover:bg-secondary rounded-r-full" aria-label="Augmenter">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg text-foreground">{formatCDF(it.price * it.quantity)}</span>
                    <button onClick={() => remove(it.productId)} className="text-muted-foreground hover:text-destructive" aria-label="Supprimer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="sticky top-24 h-fit rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl text-primary">Récapitulatif</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Sous-total</dt>
              <dd className="font-medium">{formatCDF(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Livraison</dt>
              <dd className="text-muted-foreground">calculée à l'étape suivante</dd>
            </div>
          </dl>
          <div className="mt-5 flex items-baseline justify-between border-t border-border pt-5">
            <span className="font-display text-lg text-primary">Total</span>
            <span className="font-display text-2xl">{formatCDF(subtotal)}</span>
          </div>
          <Link
            to="/commande"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-warm hover:-translate-y-0.5 transition-transform"
          >
            Passer commande <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/catalogue" className="mt-3 inline-flex w-full items-center justify-center text-sm text-muted-foreground hover:text-primary">
            Continuer mes achats
          </Link>
        </aside>
      </div>
    </div>
  );
}
