import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getSettings, setDeliveryFee } from "@/lib/admin.functions";
import { formatCDF } from "@/lib/format";

export default function SettingsPanel() {
  const get = useServerFn(getSettings);
  const setFee = useServerFn(setDeliveryFee);
  const [delivery, setDelivery] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await get();
        setDelivery(res?.delivery_fee_cdf ?? null);
        setValue(res?.delivery_fee_cdf ?? 10000);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const save = async () => {
    try {
      await setFee({ data: { value: Number(value) } });
      setDelivery(Number(value));
      setEditing(false);
      alert("Montant de livraison mis à jour");
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="mt-3 flex items-center justify-between">
      <div>
        <div className="text-sm text-muted-foreground">Frais de livraison</div>
        <div className="mt-1 font-medium">{delivery !== null ? formatCDF(delivery) : "-"}</div>
      </div>
      <div className="flex items-center gap-2">
        {editing ? (
          <>
            <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="input w-40" />
            <button onClick={save} className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Enregistrer</button>
            <button onClick={() => setEditing(false)} className="text-sm">Annuler</button>
          </>
        ) : (
          <button onClick={() => setEditing(true)} className="rounded-full border px-4 py-2 text-sm">Modifier</button>
        )}
      </div>
    </div>
  );
}
