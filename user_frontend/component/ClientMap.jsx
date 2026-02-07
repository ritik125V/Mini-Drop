import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Auto-fit map to markers
function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
    }
  }, [points, map]);

  return null;
}

export default function ClientMap({ clientCoordinates, warehouseCoordinates }) {
  const [route, setRoute] = useState([]);
  console.log("ClientMap coords:", clientCoordinates, warehouseCoordinates);

  useEffect(() => {
    if (!clientCoordinates || !warehouseCoordinates) return;

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/\
${warehouseCoordinates.lng},${warehouseCoordinates.lat};\
${clientCoordinates.lng},${clientCoordinates.lat}?\
overview=full&geometries=geojson`;

        const res = await axios.get(url);

        const coords = res.data.routes[0].geometry.coordinates;

        // OSRM gives [lng, lat], Leaflet needs [lat, lng]
        const latLngs = coords.map(([lng, lat]) => [lat, lng]);

        setRoute(latLngs);
      } catch (err) {
        console.error("Route fetch failed", err);
      }
    };

    fetchRoute();
  }, [clientCoordinates, warehouseCoordinates]);

  if (!clientCoordinates || !warehouseCoordinates) return null;

  const points = [
    [clientCoordinates.lat, clientCoordinates.lng],
    [warehouseCoordinates.lat, warehouseCoordinates.lng],
  ];

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden">
      <MapContainer
        center={points[0]}
        zoom={14}
        className="w-full h-full"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[warehouseCoordinates.lat, warehouseCoordinates.lng]} />
        <Marker position={[clientCoordinates.lat, clientCoordinates.lng]} />

        {route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: "#16a34a",
              weight: 5,
              opacity: 0.9,
            }}
          />
        )}

        <FitBounds points={points} />
      </MapContainer>
    </div>
  );
}
