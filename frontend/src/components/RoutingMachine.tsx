import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

type Props = {
  waypoints: { lat: number; lng: number }[];
};

const RoutingMachine: React.FC<Props> = ({ waypoints }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !waypoints.length) return;

    // Remove previous routes if any
    if (map._routingControl) {
      map.removeControl(map._routingControl);
      map._routingControl = undefined;
    }

    const routingControl = L.Routing.control({
      waypoints: waypoints.map((wp) => L.latLng(wp.lat, wp.lng)),
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: "#4094f7", weight: 3 }]
      },
      createMarker: function(i, wp) {
        return L.marker(wp.latLng);
      },
    }).addTo(map);

    map._routingControl = routingControl;

    return () => {
      if (map._routingControl) {
        map.removeControl(map._routingControl);
        map._routingControl = undefined;
      }
    };
  }, [map, waypoints]);

  return null;
};

export default RoutingMachine;