import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/format";

export const Route = createFileRoute("/commande-confirmee")({
  validateSearch: z.object({ order: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Commande confirmée — HB Cosmétique" },
      { name: "description", content: "Votre commande HB Cosmétique a bien été enregistrée." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => {
    const { order } = Route.useSearch();
    return (
      <div className="container-wide py-20">
        <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-10 text-center shadow-soft">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-leaf-gradient text-primary-foreground">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-6 font-display text-3xl text-primary md:text-4xl">Merci pour votre commande !</h1>
          {order && (
            <p className="mt-3 text-muted-foreground">
              Numéro de commande : <span className="font-mono font-semibold text-foreground">{order}</span>
            </p>
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            Notre équipe vous contactera très bientôt par téléphone ou WhatsApp pour confirmer la livraison et le paiement.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={whatsappUrl(`Bonjour, je viens de passer la commande ${order ?? ""}.`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
            >
              <MessageCircle className="h-4 w-4" /> Contacter sur WhatsApp
            </a>
            <Link to="/catalogue" className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium text-primary">
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    );
  },
});
