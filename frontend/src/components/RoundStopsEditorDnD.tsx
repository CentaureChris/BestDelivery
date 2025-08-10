import React, { useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import type { AddressRound } from "../types";
import { reorderRoundAddressesIds } from "../api/apiRound";

type Props = {
  roundId: number;
  addresses: AddressRound[];
  onAddressesChange: (a: AddressRound[]) => void;
};

const RoundStopsEditorDnD: React.FC<Props> = ({ roundId, addresses, onAddressesChange }) => {
  const [saving, setSaving] = useState(false);

  const ordered = useMemo(() => {
    return [...addresses].sort((a, b) => {
      const oa = (a as any).pivot?.order ?? (a as any).order ?? 0;
      const ob = (b as any).pivot?.order ?? (b as any).order ?? 0;
      return oa - ob;
    });
  }, [addresses]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(ordered);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    // optimistic UI: compute new order IDs
    const newIds = items.map(a => a.id);
    setSaving(true);
    try {
      const { addresses: updated } = await reorderRoundAddressesIds(roundId, newIds);
      onAddressesChange(updated);
    } catch (e) {
      console.error(e);
      // optional: toast error and revert
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Réordonner les étapes</h3>
        {saving && <span className="text-sm text-gray-500">Sauvegarde…</span>}
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="stops">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="border rounded-md divide-y"
            >
              {ordered.map((a, idx) => (
                <Draggable key={a.id} draggableId={String(a.id)} index={idx}>
                  {(prov, snapshot) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      className={`p-3 flex items-center justify-between bg-white ${
                        snapshot.isDragging ? "shadow-md" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-gray-600 text-sm">{idx + 1}</span>
                        <div className="text-sm">
                          <div className="font-medium">{a.address_text}</div>
                          <div className="text-xs text-gray-500">
                            {Number(a.latitude).toFixed(5)}, {Number(a.longitude).toFixed(5)}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-gray-100">
                        {(a as any).pivot?.delivered ? "Livré" : "À livrer"}
                      </span>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default RoundStopsEditorDnD;