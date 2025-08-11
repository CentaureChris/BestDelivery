import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import RoutingMachine from "./RoutingMachine";
import { type AddressRound } from "../types/index";

import blueMarkerUrl from "leaflet/dist/images/marker-icon.png";
import greenMarkerUrl from "../assets/images/marker-icon-2x-green.png";
import redMarkerUrl from "../assets/images/marker-icon-2x-red.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
const iconBlue = new L.Icon({
  iconUrl: blueMarkerUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const iconGreen = new L.Icon({
  iconUrl: greenMarkerUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const iconRed = new L.Icon({
  iconUrl: redMarkerUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  addresses: AddressRound[];
  polyline?: [number, number[] | null];
};

const MapView: React.FC<Props> = ({ addresses, polyline }) => {
  const validAddresses = addresses
    .map(a => ({
      ...a,
      latitude:
        typeof a.latitude === "string" ? parseFloat(a.latitude) : a.latitude,
      longitude:
        typeof a.longitude === "string" ? parseFloat(a.longitude) : a.longitude,
    }))
    .filter(
      a =>
        typeof a.latitude === "number" &&
        typeof a.longitude === "number" &&
        !isNaN(a.latitude) &&
        !isNaN(a.longitude)
    );

  if (validAddresses.length === 0) {
    return (
      <div style={{ height: 350, background: "#e6ecfa" }}>No itinerary</div>
    );
  }

  const waypoints = validAddresses.map(a => ({
    lat: a.latitude as number,
    lng: a.longitude as number,
  }));

  const center: [number, number] = [
    validAddresses[0].latitude as number,
    validAddresses[0].longitude as number,
  ];

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "45vh", borderRadius: 16, margin: "1rem 1rem" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {validAddresses.map((a, i) => {
        let icon = iconBlue;
        if (i === 0) icon = iconGreen; 
        else if (i === validAddresses.length - 1) icon = iconRed; 
        return (
          <Marker
            key={i}
            position={[a.latitude as number, a.longitude as number]}
            icon={icon} 
          >
            <Popup>
              <b>Stop {i + 1}</b>
              <br />
              {a.address_text}
            </Popup>
          </Marker>
        );
      })}

      {polyline && <Polyline positions={polyline} color="#4094f7" weight={5} />}
      <RoutingMachine waypoints={waypoints} />
    </MapContainer>
  );
};

export default MapView;