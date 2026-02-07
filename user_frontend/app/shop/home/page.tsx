"use client";

import React, { use, useEffect, useState } from "react";
import axios from "axios";
import SearchLauncher from "../../../component/searchLauncher";
import ProductCard from "../../../component/productCard";
import { motion } from "framer-motion";
import Header from "../../../component/layout/Header";
import HomeSearch from "../../../component/home/HomeSearch";
import ProductSkeleton from "../../../component/home/ProductSkeleton";
import BannerImage from "../../../component/ui/BannerImage";
import CartButton from "../../../component/ui/CartButton";
import AddressPopupWindow from "@/component/home/AddressPopupWindow";
import AddressNotServicable from "@/component/home/AddressNotServicable";
import Loader from "@/component/ui/Loader";

// import { getSocket } from "../../lib/socket/socket_client.js"; // uncomment if socket usage is needed

export default function HomePage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [address, setAddress] = useState<any>(null);
  const [nearestWarehouse, setNearestWarehouse] = useState<any>(null);
  const [isaddressServable, setIsAddressServable] = useState<boolean>(false);
  const [route, setRoute] = useState<Array<[number, number]>>([]);
  const [reqStatus, setReqStatus] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [eta, setEta] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [loginStatus, setLoginStatus] = useState<boolean>(true);
  const [isAddressPopupVisible, setIsAddressPopupVisible] =
    useState<boolean>(false);
  const [getUser, setGetUser] = useState<boolean>(false);
  const [popularSectionTheme, setPopularSectionTheme] =
    useState<"bg-gray-50  w-full sm:px-8 px-2 py-2">(
      "bg-gray-50  w-full sm:px-8 px-2 py-2",
    );
  // Products (fetched from API on mount)
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);
  const [ready, setReady] = useState<boolean>(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        process.env.NEXT_PUBLIC_API_ONE_BASE + "/customer/featured-products" ||
          "http://localhost:5000/api/v1/customer/featured-products",
        {
          withCredentials: true,
        },
      );
      setProducts(res.data.products);
      console.log("Featured products :", res.data);
      console.log("login status in featured products api :", res.data.login_status);
      setLoginStatus(res.data.login_status);
    } catch (error) {
      console.error("Failed to fetch products, using fallback sample:", error);
      // Fallback sample data (from your example)
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    if (!location || !isaddressServable) return;
    fetchProducts();
  }, [location ,isaddressServable]);

  async function fetchProfile() {
    setGetUser(true);
    try {
      const res = await axios.get(
        process.env.NEXT_PUBLIC_API_ONE_BASE + "/customer/profile",
        {
          withCredentials: true,
        },
      );
      if (!res.data.success) {
        setLoginStatus(false);
        setGetUser(false);
      } else {
        setLoginStatus(true);
        setGetUser(false);
      }
      // set addresses

      console.log("user : ", res.data.user);
    } catch (err) {
      // Not logged in → redirect
      // router.replace("/auth/login");
    } finally {
    }
  }

  function fetchUserSelectedAddress() {
    const savedAddress = localStorage.getItem("user_selected_address");
    if (savedAddress) {
      setIsAddressPopupVisible(false);
      const parsedAddress = JSON.parse(savedAddress);
      setLocation({
        lat: parsedAddress.lat,
        lng: parsedAddress.lng,
      });
    } else {
      setIsAddressPopupVisible(true);
    }
  }

  useEffect(()=>{
    if(!loginStatus){
      setIsAddressPopupVisible(true);
    }
    else{
      setIsAddressPopupVisible(false);
      fetchProfile();
      fetchUserSelectedAddress();
    }
  },[loginStatus]);


  function ChangeCurrentAddress() {
    setIsAddressPopupVisible(true);
  }

  //  check if logined in is false
  /* ---------------- Get User Location ---------------- */

  function getCurrentLocation() {
    localStorage.removeItem("user_selected_address");

    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setLocation(coords);

        localStorage.setItem("user_selected_address", JSON.stringify(coords));

        setIsAddressPopupVisible(false);

        console.log("Location access granted:", coords);
      },
      (err) => {
        console.error("Location error:", err.message);
      },
      { enableHighAccuracy: true },
    );
  }

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
          },
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
          process.env.NEXT_PUBLIC_API_ONE_BASE + "/customers/nearest-store" ||
            "http://localhost:5000/api/v1/customers/nearest-store",
          { user_coordinates: location },
        );
        console.log("nearest warehouse data  :", res);
        if (res.data.success) {
          setReqStatus(res.data.success);
          setNearestWarehouse(res.data.store);
          setIsAddressServable(true);
        } else {
          setReqStatus(res.data.success);
          setNearestWarehouse(null);
          setIsAddressServable(false);
        }
      } catch (err) {
        console.error("error occured :", err);
        setReqStatus(false);
        setNearestWarehouse(null);
        setIsAddressServable(false);
      }
    })();
  }, [location]);

  /* ---------------- Fetch Route + ETA + Distance ---------------- */
  useEffect(() => {
    if (!location || !nearestWarehouse) return;

    const fetchRoute = async () => {
      try {
        if (nearestWarehouse == null) return;
        const url = `https://router.project-osrm.org/route/v1/foot/${location.lng},${location.lat};${nearestWarehouse.location.coordinates[0]},${nearestWarehouse.location.coordinates[1]}?overview=full&geometries=polyline`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.routes?.length) {
          const routeData = data.routes[0];
          // Distance (meters → km)
          setDistance(parseFloat((routeData.distance / 1000).toFixed(2)));
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

  useEffect(() => {
    setInterval(() => {
      setReady(true);
    }, 1000);
  });
  if (!ready) {
    return <Loader />;
  }

  return (
  <div className="min-h-screen bg-white text-black">
    <Header
      iswarehouse_present={nearestWarehouse == null ? false : true}
      address={address}
      eta={eta}
      distance={distance}
      address_viewMode={true}
      isLogedIn={loginStatus}
      onChangeCurrentAddress={ChangeCurrentAddress}
    />

    {isaddressServable ? (
      <>
        <HomeSearch />

        {isAddressPopupVisible && (
          <AddressPopupWindow
            userAddress={address ? address : null}
            onSelect={(addr: string) => {
              console.log("Selected Address :", addr);
            }}
            onClose={() => setIsAddressPopupVisible(false)}
            onCurrentLocationSelect={() => getCurrentLocation()}
          />
        )}

        <BannerImage />
        <CartButton />

        <main className="pb-24 w-full border">
          {/* popular section */}
          <div className={`${popularSectionTheme} border border-black`}>
            <h2 className="text-xl font-bold mb-4">Popular near you</h2>

            {productsLoading ? (
              <ProductSkeleton />
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2 border">
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
      </>
    ) : (
      <AddressNotServicable />
    )}
  </div>
);

}
