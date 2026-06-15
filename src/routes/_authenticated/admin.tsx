import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Loader2, LogOut, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { listAdminOrders, updateOrderStatus, checkIsAdmin } from "@/lib/admin.functions";
import { formatCDF } from "@/lib/format";

const STATUSES = ["pending", "payment_confirmed", "preparing", "shipped", "delivered", "cancelled"] as const;
type Status = typeof STATUSES[number];

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — HB Cosmétique" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const check = useServerFn(checkIsAdmin);
  const fetchOrders = useServerFn(listAdminOrders);
  const updateStatus = useServerFn(updateOrderStatus);

  const adminQuery = useQuery({ queryKey: ["isAdmin"], queryFn: () => check() });
  const ordersQuery = useQuery({
    queryKey: ["adminOrders"],
    queryFn: () => fetchOrders(),
    enabled: !!adminQuery.data?.isAdmin,
  });

  const [updating, setUpdating] = useState<string | null>(null);

  async function handleStatus(id: string, status: Status) {
    setUpdating(id);
    try {
      await updateStatus({ data: { id, status } });
      toast.success("Statut mis à jour");
      qc.invalidateQueries({ queryKey: ["adminOrders"] });
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    } finally {
      setUpdating(null);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (adminQuery.isLoading) {
    return <div className="container-wide py-20 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>;
  }

  if (!adminQuery.data?.isAdmin) {
    return (
      <div className="container-wide py-20 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
        <h1 className="mt-4 font-display text-2xl text-primary">Accès refusé</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Votre compte n'a pas le rôle administrateur.<br />
          ID utilisateur : <code className="text-xs">{adminQuery.data?.userId}</code>
        </p>
        <button onClick={signOut} className="mt-6 rounded-full bg-secondary px-5 py-2 text-sm">Se déconnecter</button>
      </div>
    );
  }

  const orders = ordersQuery.data ?? [];

  return (
    <div className="container-wide py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-primary md:text-4xl">Dashboard admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">{orders.length} commande(s)</p>
        </div>
        <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm">
          <LogOut className="h-4 w-4" /> Déconnexion
        </button>
      </div>

      {ordersQuery.isLoading && <div className="mt-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></div>}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">N°</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Commune</th>
              <th className="px-4 py-3">Produits</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o.id} className="border-t border-border align-top">
                <td className="px-4 py-3 font-mono text-xs">{o.order_number}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{o.customer_name}</div>
                  <div className="text-xs text-muted-foreground">{o.customer_phone}</div>
                </td>
                <td className="px-4 py-3">{o.commune}</td>
                <td className="px-4 py-3 text-xs">
                  {(o.order_items ?? []).map((it: any, i: number) => (
                    <div key={i}>{it.product_name} ×{it.quantity}</div>
                  ))}
                </td>
                <td className="px-4 py-3 font-semibold">{formatCDF(o.total_cdf)}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(o.created_at).toLocaleString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    disabled={updating === o.id}
                    onChange={(e) => handleStatus(o.id, e.target.value as Status)}
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && !ordersQuery.isLoading && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">Aucune commande pour le moment.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
