import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

type WP = { lat: number; lng: number };

const RoutingMachine: React.FC<{ waypoints: WP[] }> = ({ waypoints }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || waypoints.length === 0) return;

    const ctrl = L.Routing.control({
      waypoints: waypoints.map(wp => L.latLng(wp.lat, wp.lng)),
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      lineOptions: {
        styles: [{ color: "#4094f7", weight: 3 }]
      },
      // 🔑 don't draw LRM markers; we'll render our own in MapView
      createMarker: () => null,
    }).addTo(map);

    return () => {
      map.removeControl(ctrl);
    };
  }, [map, waypoints]);

  return null;
};

export default RoutingMachine;