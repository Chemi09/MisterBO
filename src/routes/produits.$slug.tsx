import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, MessageCircle, ShieldCheck, Star, ArrowLeft, Truck, Leaf } from "lucide-react";
import { fetchProductBySlug, fetchProducts, fetchReviews } from "@/lib/queries";
import { formatCDF, whatsappUrl, BRAND } from "@/lib/format";
import { imageForProduct } from "@/lib/images";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/ProductCard";
import { toast } from "sonner";

export const Route = createFileRoute("/produits/$slug")({
  loader: async ({ params, context }) => {
    const product = await context.queryClient.ensureQueryData({
      queryKey: ["product", params.slug],
      queryFn: () => fetchProductBySlug(params.slug),
    });
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData?.product
      ? [
          { title: `${loaderData.product.name} — ${BRAND.name}` },
          { name: "description", content: loaderData.product.tagline ?? loaderData.product.description.slice(0, 160) },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:description", content: loaderData.product.tagline ?? "" },
          { property: "og:image", content: loaderData.product.image_url },
          { property: "og:type", content: "product" },
        ]
      : [],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", product.id],
    queryFn: () => fetchReviews(product.id),
  });
  const { data: all = [] } = useQuery({ queryKey: ["products"], queryFn: () => fetchProducts() });
  const related = all.filter((p) => p.id !== product.id).slice(0, 3);

  const discount =
    product.compare_at_price_cdf && product.compare_at_price_cdf > product.price_cdf
      ? Math.round(((product.compare_at_price_cdf - product.price_cdf) / product.compare_at_price_cdf) * 100)
      : 0;
  const lowStock = product.stock > 0 && product.stock <= product.low_stock_threshold;
  const outOfStock = product.stock <= 0;

  const handleAdd = () => {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price_cdf,
        image: product.image_url,
      },
      qty,
    );
    toast.success(`${product.name} ajouté au panier`);
  };

  const waMessage = `Bonjour ${BRAND.name}, je souhaite commander :\n• ${product.name} (x${qty}) — ${formatCDF(product.price_cdf * qty)}\n\nMerci de me confirmer la disponibilité.`;

  return (
    <div className="container-wide py-8 md:py-12">
      <Link to="/catalogue" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Retour à la boutique
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl bg-cream shadow-soft">
          <img src={imageForProduct(product)} alt={product.name} className="aspect-square w-full object-cover" />
          {discount > 0 && (
            <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
              -{discount}%
            </span>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {product.category === "pack" ? "Pack signature" : `Savon ${product.category}`}
          </p>
          <h1 className="mt-2 font-display text-4xl text-primary md:text-5xl">{product.name}</h1>
          <p className="mt-3 text-lg italic text-muted-foreground">{product.tagline}</p>

          {reviews.length > 0 && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <span className="text-muted-foreground">({reviews.length} avis)</span>
            </div>
          )}

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl text-foreground">{formatCDF(product.price_cdf)}</span>
            {product.compare_at_price_cdf && product.compare_at_price_cdf > product.price_cdf && (
              <span className="text-lg text-muted-foreground line-through">
                {formatCDF(product.compare_at_price_cdf)}
              </span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-foreground/85">{product.description}</p>

          {product.benefits.length > 0 && (
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {(product.benefits as string[]).map((b: string) => (
                <li key={b} className="flex items-start gap-2 text-sm">
                  <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {b}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-border bg-card">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center text-primary hover:bg-secondary rounded-l-full" aria-label="Diminuer">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))} className="grid h-11 w-11 place-items-center text-primary hover:bg-secondary rounded-r-full" aria-label="Augmenter">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {outOfStock ? (
              <span className="text-sm font-medium text-destructive">Rupture de stock</span>
            ) : lowStock ? (
              <span className="text-sm font-medium text-accent">Plus que {product.stock} en stock !</span>
            ) : (
              <span className="text-sm text-muted-foreground">En stock</span>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-warm transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              <ShoppingBag className="h-4 w-4" /> Ajouter au panier
            </button>
            <a
              href={whatsappUrl(waMessage)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-primary/20 bg-background px-6 py-3.5 text-sm font-semibold text-primary hover:bg-secondary"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>

          <div className="mt-8 grid gap-3 rounded-2xl bg-cream p-5 text-sm">
            <div className="flex items-center gap-3"><Truck className="h-4 w-4 text-primary" /> Livraison dans les 24 communes de Kinshasa</div>
            <div className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-primary" /> Paiement à la livraison & Mobile Money</div>
          </div>

          {(product.composition || product.usage_instructions) && (
            <div className="mt-8 space-y-4">
              {product.composition && (
                <details className="rounded-xl border border-border bg-card p-4 open:shadow-soft" open>
                  <summary className="cursor-pointer font-medium text-primary">Composition</summary>
                  <p className="mt-2 text-sm text-muted-foreground">{product.composition}</p>
                </details>
              )}
              {product.usage_instructions && (
                <details className="rounded-xl border border-border bg-card p-4 open:shadow-soft">
                  <summary className="cursor-pointer font-medium text-primary">Conseils d'utilisation</summary>
                  <p className="mt-2 text-sm text-muted-foreground">{product.usage_instructions}</p>
                </details>
              )}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-display text-3xl text-primary">Vous aimerez aussi</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
