import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { AddressRound } from "../types";
import { reorderRoundAddressesIds, updateAddressDelivered } from "../api/apiRound";

interface Props {
  roundId: number;
  initialAddresses: AddressRound[];
}

const EditableAddressList: React.FC<Props> = ({ roundId, initialAddresses }) => {
  const [addresses, setAddresses] = useState<AddressRound[]>(initialAddresses);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const newOrder = Array.from(addresses);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);

    setAddresses(newOrder);

    // Send new order to backend
    await reorderRoundAddressesIds(
      roundId,
      newOrder.map(a => a.id)
    );
  };

  const handleDeliveredChange = async (addressId: number, delivered: boolean) => {
    setAddresses(prev =>
      prev.map(a => a.id === addressId ? { ...a, delivered } : a)
    );

    await updateAddressDelivered(roundId, addressId, delivered);
  };

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="address-list">
          {provided => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {addresses.map((a, index) => (
                <Draggable key={a.id} draggableId={a.id.toString()} index={index}>
                  {provided => (
                    <li
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className="p-3 bg-white rounded shadow flex items-center justify-between"
                    >
                      <span>{index + 1}. {a.address_text}</span>
                      <label className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={a.delivered || false}
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

export default EditableAddressList;