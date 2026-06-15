import { Link } from "@tanstack/react-router";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { BRAND } from "@/lib/format";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/catalogue", label: "Boutique" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="container-wide flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-primary">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-leaf-gradient text-primary-foreground shadow-soft">
                    <img src="/images/logo.png" alt={BRAND.name} className="h-8 w-8 object-contain" />
          </span>
          <span className="hidden sm:inline">{BRAND.name}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/panier"
            className="relative grid h-10 w-10 place-items-center rounded-full text-primary transition-colors hover:bg-secondary"
            aria-label="Panier"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-xs font-semibold text-accent-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            className="grid h-10 w-10 place-items-center rounded-full text-primary md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className={cn("border-t border-border/60 bg-background md:hidden", open ? "block" : "hidden")}>
        <div className="container-wide flex flex-col gap-1 py-3">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-primary"
              activeProps={{ className: "bg-secondary text-primary" }}
              onClick={() => setOpen(false)}
            >
              {n.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
