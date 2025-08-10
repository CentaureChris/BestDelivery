import React, { useMemo, useState } from "react";
import type { AddressRound } from "../types";
import { updateRoundAddress } from "../api/apiRound";

type Props = {
  roundId: number;
  addresses: AddressRound[];
  onAddressesChange: (addrs: AddressRound[]) => void;
};

const RoundStopsEditor: React.FC<Props> = ({ roundId, addresses, onAddressesChange }) => {
  const [savingId, setSavingId] = useState<number | null>(null);

  // Prefer pivot.order / pivot.delivered if present, fallback to flat fields
  const ordered = useMemo(() => {
    return [...addresses].sort((a, b) => {
      const oa = (a as any).pivot?.order ?? (a as any).order ?? 999999;
      const ob = (b as any).pivot?.order ?? (b as any).order ?? 999999;
      return oa - ob;
    });
  }, [addresses]);

  const isDelivered = (a: AddressRound) =>
    (a as any).pivot?.delivered ?? (a as any).delivered ?? false;

  const currentOrder = (a: AddressRound) =>
    (a as any).pivot?.order ?? (a as any).order ?? 0;

  const handleToggleDelivered = async (addr: AddressRound) => {
    try {
      setSavingId(addr.id);
      const next = !isDelivered(addr);
      const { addresses: updated } = await updateRoundAddress(roundId, addr.id, { delivered: next });
      onAddressesChange(updated);
    } catch (e) {
      console.error(e);
      // you can toast here
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Étapes</h3>
      <div className="border rounded-md divide-y">
        {ordered.map((a, idx) => (
          <div key={a.id} className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <span className="text-sm w-6 text-gray-600">{currentOrder(a) || idx + 1}</span>
              <div className="text-sm">
                <div className="font-medium">{a.address_text}</div>
                <div className="text-xs text-gray-500">
                  {Number(a.latitude).toFixed(5)}, {Number(a.longitude).toFixed(5)}
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isDelivered(a)}
                disabled={savingId === a.id}
                onChange={() => handleToggleDelivered(a)}
              />
              Livré
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoundStopsEditor;