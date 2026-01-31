"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import polyline from "@mapbox/polyline";
import "leaflet/dist/leaflet.css";

export default function ClientMap({clientCoordinates , warehouseCoordinates}) {
  const [L, setL] = useState(null);
  const [LeafletComponents, setLeafletComponents] = useState(null);

  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [nearestWarehouse, setNearestWarehouse] = useState(null);
  const [route, setRoute] = useState([]);
  const [eta, setEta] = useState(null);
  const [distance, setDistance] = useState(null);

  /* ---------------- Load Leaflet + react-leaflet SAFELY ---------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    Promise.all([
      import("leaflet"),
      import("react-leaflet"),
    ]).then(([leaflet, reactLeaflet]) => {
      // Fix default marker icons
      delete leaflet.Icon.Default.prototype._getIconUrl;

      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      setL(leaflet);
      setLeafletComponents(reactLeaflet);
    });
  }, []);

  /* ---------------- Icons ---------------- */
  const userIcon = useMemo(() => {
    if (!L) return null;
    return new L.Icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      iconSize: [36, 36],
      iconAnchor: [18, 36],
    });
  }, [L]);

  const warehouseIcon = useMemo(() => {
    if (!L) return null;
    return new L.Icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      iconSize: [42, 42],
      iconAnchor: [21, 42],
    });
  }, [L]);

  /* ---------------- Location ---------------- */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  }, []);

  /* ---------------- Reverse Geocode ---------------- */
  useEffect(() => {
    if (!location) return;

    axios
      .get("https://nominatim.openstreetmap.org/reverse", {
        params: {
          format: "jsonv2",
          lat: location.lat,
          lon: location.lng,
        },
      })
      .then((res) => setAddress(res.data.address));
  }, [location]);

  /* ---------------- Nearest Warehouse ---------------- */
  useEffect(() => {
    if (!location) return;

    axios
      .post(
        process.env.NEXT_PUBLIC_API_ONE_BASE +
          "/customers/nearest-store",
        { user_coordinates: location }
      )
      .then((res) => setNearestWarehouse(res.data.store));
  }, [location]);

  /* ---------------- Route ---------------- */
  useEffect(() => {
    if (!location || !nearestWarehouse) return;

    fetch(
      `https://router.project-osrm.org/route/v1/foot/${location.lng},${location.lat};${nearestWarehouse.location.coordinates[0]},${nearestWarehouse.location.coordinates[1]}?overview=full&geometries=polyline`
    )
      .then((res) => res.json())
      .then((data) => {
        const routeData = data.routes?.[0];
        if (!routeData) return;

        const decoded = polyline.decode(routeData.geometry);
        setRoute(decoded.map(([lat, lng]) => [lat, lng]));
        setDistance((routeData.distance / 1000).toFixed(2));
        setEta(Math.ceil(routeData.duration / 60));
      });
  }, [location, nearestWarehouse]);

  /* ---------------- Render ---------------- */
  if (!L || !LeafletComponents || !location) {
    return <p className="text-white p-4">Loading map…</p>;
  }

  const {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
  } = LeafletComponents;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="px-4 pt-5 pb-3">
        {address && (
          <p className="text-sm">
            📍 {address.road}, {address.city}, {address.state}
          </p>
        )}
        {eta && distance && (
          <p className="text-xs">
            ⏱ {eta} min • 📏 {distance} km
          </p>
        )}
      </header>

      <div className="mx-4 rounded-3xl overflow-hidden">
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={13}
          className="h-[48vh] w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {route.length > 0 && (
            <Polyline
              positions={route}
              pathOptions={{ color: "#00e676", weight: 4 }}
            />
          )}

          <Marker position={[location.lat, location.lng]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>

          {nearestWarehouse && (
            <Marker
              position={[
                nearestWarehouse.location.coordinates[1],
                nearestWarehouse.location.coordinates[0],
              ]}
              icon={warehouseIcon}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
