import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import type { AddressRound } from "../types";
import { reorderRoundAddressesIds, updateAddressDelivered } from "../api/apiRound";

interface Props {
  roundId: number;
  addresses: AddressRound[]; // <- matches parent
  onAddressesChange: (addrs: AddressRound[]) => void; // <- matches parent
}

const RoundStopsEditorDnD: React.FC<Props> = ({ roundId, addresses: propsAddresses, onAddressesChange }) => {
  const [addresses, setAddresses] = useState<AddressRound[]>(propsAddresses ?? []);
  const [savingId, setSavingId] = useState<number | null>(null);

  // keep local list in sync with parent changes
  useEffect(() => {
    setAddresses(propsAddresses ?? []);
  }, [propsAddresses]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const newOrder = Array.from(addresses);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);

    setAddresses(newOrder); // optimistic
    onAddressesChange(newOrder); // reflect in parent immediately

    try {
      await reorderRoundAddressesIds(
        roundId,
        newOrder.map(a => a.id)
      );
      // Optionally refetch here if backend adjusts anything
    } catch (e) {
      // revert on error
      setAddresses(propsAddresses);
      onAddressesChange(propsAddresses);
      console.error(e);
    }
  };

  const handleDeliveredChange = async (addressId: number, delivered: boolean) => {
    // optimistic
    const next = addresses.map(a => (a.id === addressId ? { ...a, delivered } : a));
    setAddresses(next);
    onAddressesChange(next);

    try {
      setSavingId(addressId);
      await updateAddressDelivered(roundId, addressId, delivered);
    } catch (e) {
      // revert on error
      const reverted = addresses.map(a => (a.id === addressId ? { ...a, delivered: !delivered } : a));
      setAddresses(reverted);
      onAddressesChange(reverted);
      console.error(e);
    } finally {
      setSavingId(null);
    }
  };

  if (!addresses || addresses.length === 0) {
    return <div className="text-sm text-gray-500 mt-4">Aucune adresse à afficher.</div>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Étapes</h3>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="address-list">
          {provided => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {addresses.map((a, index) => (
                <Draggable key={a.id} draggableId={a.id.toString()} index={index}>
                  {provided => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-3 bg-white rounded shadow flex items-center justify-between"
                    >
                      <span className="text-sm">
                        {index + 1}. {a.address_text}
                      </span>
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={!!a.delivered}
                          disabled={savingId === a.id}
                          onChange={e => handleDeliveredChange(a.id, e.target.checked)}
                        />
                        <span>Livré</span>
                      </label>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default RoundStopsEditorDnD;