import { Link } from "@tanstack/react-router";
import { formatCDF } from "@/lib/format";
import type { Product } from "@/lib/queries";
import { imageForProduct } from "@/lib/images";

export function ProductCard({ product }: { product: Product }) {
  const discount =
    product.compare_at_price_cdf && product.compare_at_price_cdf > product.price_cdf
      ? Math.round(((product.compare_at_price_cdf - product.price_cdf) / product.compare_at_price_cdf) * 100)
      : 0;

  return (
    <Link
      to="/produits/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-warm"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        <img
          src={imageForProduct(product)}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.is_featured && product.category === "pack" && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground shadow-soft">
            Recommandé
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            -{discount}%
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {product.category === "pack" ? "Pack" : `Savon ${product.category}`}
        </p>
        <h3 className="font-display text-xl text-primary">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.tagline}</p>
        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="font-display text-2xl text-foreground">{formatCDF(product.price_cdf)}</span>
          {product.compare_at_price_cdf && product.compare_at_price_cdf > product.price_cdf && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCDF(product.compare_at_price_cdf)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
