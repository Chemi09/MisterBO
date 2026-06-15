import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { fetchProducts } from "@/lib/queries";
import { BRAND } from "@/lib/format";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  category: z.enum(["all", "curcuma", "riz", "pack"]).optional().default("all"),
  sort: z.enum(["popular", "price-asc", "price-desc"]).optional().default("popular"),
});

export const Route = createFileRoute("/catalogue")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: `Boutique — ${BRAND.name}` },
      { name: "description", content: "Tous nos savons bio : curcuma, riz, et le Pack Duo recommandé. Livraison dans les 24 communes de Kinshasa." },
      { property: "og:title", content: `Boutique ${BRAND.name}` },
      { property: "og:description", content: "Découvrez la gamme Savon Mister Bo." },
    ],
  }),
  component: Catalogue,
});

const categories = [
  { value: "all", label: "Tous" },
  { value: "pack", label: "Packs" },
  { value: "curcuma", label: "Curcuma" },
  { value: "riz", label: "Riz" },
] as const;

function Catalogue() {
  const { category, sort } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", category],
    queryFn: () => fetchProducts({ category }),
  });

  const sorted = [...products].sort((a, b) => {
    if (sort === "price-asc") return a.price_cdf - b.price_cdf;
    if (sort === "price-desc") return b.price_cdf - a.price_cdf;
    return a.sort_order - b.sort_order;
  });

  return (
    <div className="container-wide py-12 md:py-16">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Boutique</p>
        <h1 className="mt-2 font-display text-4xl text-primary md:text-5xl">Notre gamme complète</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Les savons Mister Bo, 100% bio, fabriqués à Kinshasa avec amour.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.value}
              to="/catalogue"
              search={{ category: c.value, sort }}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                category === c.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-primary",
              )}
            >
              {c.label}
            </Link>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => navigate({ search: { category, sort: e.target.value as "popular" | "price-asc" | "price-desc" } })}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="popular">Popularité</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Aucun produit dans cette catégorie pour le moment.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
