import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import RoutingMachine from "./RoutingMachine";
import { type Address } from "../types/index";

type Props = { addresses: Address[] };

const MapView: React.FC<Props> = ({ addresses }) => {
  if (!addresses || addresses.length === 0) {
    return <div style={{ height: 350, background: "#e6ecfa" }}>No itinerary</div>;
  }

  const waypoints = addresses.map(a => ({
    lat: a.latitude,
    lng: a.longitude
  }));

  const center: [number, number] = [addresses[0].latitude, addresses[0].longitude];

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: 550, borderRadius: 16, margin: "1rem 1rem" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {addresses.map((a, i) => (
        <Marker key={i} position={[a.latitude, a.longitude]}>
          <Popup>
            <b>Stop {i + 1}</b><br />
            {a.address_text}
          </Popup>
        </Marker>
      ))}
      <RoutingMachine waypoints={waypoints} />
    </MapContainer>
  );
};

export default MapView;