"use client";

import { useState, useEffect, useMemo, use } from "react";
import axios from "axios";
import L from "leaflet";
import polyline from "@mapbox/polyline";
import "leaflet/dist/leaflet.css";
import { getSocket } from "../../../lib/socket/socket_client.js";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
} from "react-leaflet";

import Snowfall from "react-snowfall";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

/* ---------------- Fix Leaflet Icon ---------------- */
const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function App() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [nearestWarehouse, setNearestWarehouse] = useState(null);
  const [route, setRoute] = useState([]);
  const [reqStatus, setReqStatus] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  // NEW
  const [eta, setEta] = useState(null); // minutes
  const [distance, setDistance] = useState(null); // km

  /* ---------------- Icons ---------------- */
  const userIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      }),
    []
  );

  const warehouseIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
        iconSize: [42, 42],
        iconAnchor: [21, 42],
      }),
    []
  );

  /* ---------------- Get User Location ---------------- */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
  }, []);


  // useEffect(() => {
  //   const socket = getSocket();

  //   socket.on("connect", () => {
  //     console.log("Connected to socket server" , socket.id);
  //     setSocketConnected(true);
  //   });
  // } ,[]);

  /* ---------------- Reverse Geocode ---------------- */
  useEffect(() => {
    if (!location) return;

    (async () => {
      try {
        const res = await axios.get(
          "https://nominatim.openstreetmap.org/reverse",
          {
            params: {
              format: "jsonv2",
              lat: location.lat,
              lon: location.lng,
            },
          }
        );
        setAddress(res.data.address);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [location]);

  /* ---------------- Nearest Warehouse ---------------- */
  useEffect(() => {
    if (!location) return;

    (async () => {
      try {
        const res = await axios.post(
          process.env.NEXT_PUBLIC_API_ONE_BASE+"/customers/nearest-store"||
          "http://localhost:5000/api/v1/customers/nearest-store",
          { user_coordinates: location }
        );
        setReqStatus(res.data.success);
        setNearestWarehouse(res.data.store);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [location]);

  /* ---------------- Fetch Route + ETA + Distance ---------------- */
  useEffect(() => {
    if (!location || !nearestWarehouse) return;

    const fetchRoute = async () => {
      const url = `https://router.project-osrm.org/route/v1/foot/${location.lng},${location.lat};${nearestWarehouse.location.coordinates[0]},${nearestWarehouse.location.coordinates[1]}?overview=full&geometries=polyline`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.routes?.length) {
        const routeData = data.routes[0];

        // Decode polyline
        const decoded = polyline.decode(routeData.geometry);
        setRoute(decoded.map(([lat, lng]) => [lat, lng]));

        // Distance (meters → km)
        setDistance((routeData.distance / 1000).toFixed(2));

        // Duration (seconds → minutes)
        setEta(Math.ceil(routeData.duration / 60));
      }
    };

    fetchRoute();
  }, [location, nearestWarehouse]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white relative">
      <Snowfall snowflakeCount={50} style={{ opacity: 0.25 }} />

      {/* Header */}
      <header className="px-4 pt-5 pb-3">
        {address && (
          <div className="p-2 border border-gray-500 w-fit px-4 rounded-lg">
            <p className="text-xs underline underline-offset-2 text-gray-400 mb-1">📍Deliver Here</p>
            <p className="text-sm font-medium">
              {address.road && `${address.road}, `}
              {address.suburb && `${address.suburb}, `}
              {address.city && `${address.city}, `}
              {address.state}
            </p>
          </div>
        )}

        {eta && distance && (
          <div className="text-xs mt-1">
            ⏱ {eta +10} min • 📏 {distance} km
          </div>
        )}
      </header>
      <h1>{socketConnected ? <p className="px-2 text-green-300 font-bold">connected</p> : " Disconnected"}</h1>

      {/* Address Card */}

      {/* Map */}
      {location && (
        <div className="mx-4 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={13}
            className="h-[48vh] w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Route */}
            {route.length > 0 && (
              <>
                <Polyline
                  positions={route}
                  pathOptions={{
                    color: "#00e676",
                    weight: 8,
                    opacity: 0.25,
                  }}
                />
                <Polyline
                  positions={route}
                  pathOptions={{
                    color: "#2F4261",
                    weight: 4,
                  }}
                />
              </>
            )}

            {/* User */}
            <Marker position={[location.lat, location.lng]} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>

            {/* Warehouse */}
            {nearestWarehouse && (
              <>
                <Marker
                  position={[
                    nearestWarehouse.location.coordinates[1],
                    nearestWarehouse.location.coordinates[0],
                  ]}
                  icon={warehouseIcon}
                >
                  <Popup></Popup>
                </Marker>
              </>
            )}
          </MapContainer>
        </div>
      )}
    </div>
  );
}

