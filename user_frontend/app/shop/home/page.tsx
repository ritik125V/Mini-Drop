"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchLauncher from "../../../component/searchLauncher";
import ProductCard from '../../../component/productCard';
import { motion } from 'framer-motion' 
import Header from "../../../component/layout/Header";
import HomeSearch from "../../../component/home/HomeSearch";
import ProductSkeleton from "../../../component/home/ProductSkeleton";
import BannerImage from "../../../component/ui/BannerImage"
import CartButton from "../../../component/ui/CartButton"


// import { getSocket } from "../../lib/socket/socket_client.js"; // uncomment if socket usage is needed

export default function HomePage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [address, setAddress] = useState<any>(null);
  const [nearestWarehouse, setNearestWarehouse] = useState<any>(null);
  const [route, setRoute] = useState<Array<[number, number]>>([]);
  const [reqStatus, setReqStatus] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [eta, setEta] = useState<number | null>(null);
  const [distance, setDistance] = useState<string | null>(null);

  // Products (fetched from API on mount)
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);

  const fetchProducts = async () => {
      try {
        const res = await axios.get(process.env.NEXT_PUBLIC_API_ONE_BASE+"/customer/featured-products" || "http://localhost:5000/api/v1/customer/featured-products");
        setProducts(res.data.products);
      } catch (err) {
        console.error("Failed to fetch products, using fallback sample:", err);
        // Fallback sample data (from your example)
      } finally {
        setProductsLoading(false);
      }
    };
  useEffect(() => {
    fetchProducts();
  }, []);


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
         process.env.NEXT_PUBLIC_API_ONE_BASE+"/customers/nearest-store" || "http://localhost:5000/api/v1/customers/nearest-store",
          { user_coordinates: location }
        );
        console.log("data :",res);
        if(res.data.success){
          setReqStatus(res.data.success);
        setNearestWarehouse(res.data.store);
        }
        else{
          setReqStatus(res.data.success);
        }
      } catch (err) {
        console.error("error occured :",err);
      }
    })();
  }, [location]);

  /* ---------------- Fetch Route + ETA + Distance ---------------- */
  useEffect(() => {
    if (!location || !nearestWarehouse) return;

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/foot/${location.lng},${location.lat};${nearestWarehouse.location.coordinates[0]},${nearestWarehouse.location.coordinates[1]}?overview=full&geometries=polyline`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.routes?.length) {
          const routeData = data.routes[0];
          // Distance (meters → km)
          setDistance((routeData.distance / 1000).toFixed(2));
          // Duration (seconds → minutes)
          setEta(Math.ceil(routeData.duration / 60));
          // Decode polyline if available (non-critical)
        }
      } catch (err) {
        console.error("Failed to fetch route/eta:", err);
      }
    };

    fetchRoute();
  }, [location, nearestWarehouse]);




return (
  <div className="min-h-screen bg-white text-black">
    <Header
      address={address}
      eta={eta}
      distance={distance}
      address_viewMode = {true}
    />
    <HomeSearch />
    <BannerImage />
    <CartButton/>
    <main className=" pb-24 w-full ">
      {/* popular section */}
      <div className="bg-gray-50  w-full sm:px-8 px-2 py-2">
        <h2 className="text-xl font-bold mb-4">
        Popular near you
      </h2>

      {productsLoading ? (
        <ProductSkeleton />
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
          {products.map((p) => (
            <ProductCard
              key={p._id ?? p.productId}
              product={p}
            />
          ))}
        </div>
      )}
      </div>
    </main>
  </div>
);


}
