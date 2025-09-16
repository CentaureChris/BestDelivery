import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import type { AddressRound } from "../types";
import { reorderRoundAddressesIds, updateAddressDelivered } from "../api/apiRound";
import styles from "../assets/css/RoundStopsEditorDnD.module.css";
import { updateAddress, deleteAddress } from "../api/apiAddress";
import { geocodeAddress } from "../api/geocode";

interface Props {
  roundId: number;
  addresses: AddressRound[]; // <- matches parent
  onAddressesChange: (addrs: AddressRound[]) => void; // <- matches parent
  enableCrud?: boolean;
}

const RoundStopsEditorDnD: React.FC<Props> = ({ roundId, addresses: propsAddresses, onAddressesChange, enableCrud = false }) => {
  const [addresses, setAddresses] = useState<AddressRound[]>(propsAddresses ?? []);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");

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

  const startEdit = (a: AddressRound) => {
    setEditingId(a.id);
    setEditText(a.address_text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async (a: AddressRound) => {
    const newText = editText.trim();
    if (!newText) return;
    try {
      setSavingId(a.id);
      const coords = await geocodeAddress(newText);
      if (!coords) throw new Error("Adresse introuvable");
      const updated = await updateAddress(a.id, {
        address_text: newText,
        latitude: coords.lat,
        longitude: coords.lon,
        order: a.order,
        delivered: !!a.delivered,
        comments: a.comment ?? "",
      });

      const next = addresses.map(x => (x.id === a.id ? { ...x, ...updated } : x));
      setAddresses(next);
      onAddressesChange(next);
      setEditingId(null);
      setEditText("");
    } catch (e) {
      console.error(e);
    } finally {
      setSavingId(null);
    }
  };

  const removeAddress = async (a: AddressRound) => {
    try {
      setSavingId(a.id);
      await deleteAddress(a.id);
      const next = addresses.filter(x => x.id !== a.id);
      // Reorder pivot after removal
      setAddresses(next);
      onAddressesChange(next);
      await reorderRoundAddressesIds(roundId, next.map(x => x.id));
    } catch (e) {
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
                      className={styles.draggableItem}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-sm">
                          {index + 1}. {editingId === a.id ? (
                            <input
                              value={editText}
                              onChange={e => setEditText(e.target.value)}
                              className="px-2 py-1 border rounded"
                              disabled={savingId === a.id}
                            />
                          ) : (
                            a.address_text
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={!!a.delivered}
                            disabled={savingId === a.id}
                            onChange={e => handleDeliveredChange(a.id, e.target.checked)}
                          />
                          <span>Livré</span>
                        </label>
                        {enableCrud && (
                          <div className="flex items-center gap-2">
                            {editingId === a.id ? (
                              <>
                                <button
                                  className="px-2 py-1 bg-green-600 text-white rounded"
                                  disabled={savingId === a.id}
                                  onClick={() => saveEdit(a)}
                                >
                                  Sauver
                                </button>
                                <button
                                  className="px-2 py-1 bg-gray-300 rounded"
                                  onClick={cancelEdit}
                                >
                                  Annuler
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="px-2 py-1 bg-blue-600 text-white rounded"
                                  onClick={() => startEdit(a)}
                                >
                                  Éditer
                                </button>
                                <button
                                  className="px-2 py-1 bg-red-600 text-white rounded"
                                  disabled={savingId === a.id}
                                  onClick={() => removeAddress(a)}
                                >
                                  Supprimer
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
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
