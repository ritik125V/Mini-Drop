"use client";

import React, { use, useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../component/layout/Header";
import HomeSearch from "../../../component/home/HomeSearch";
import ProductCard from "../../../component/productCard";
import ProductSkeleton from "../../../component/home/ProductSkeleton";
import BannerImage from "../../../component/ui/BannerImage";
import CartButton from "../../../component/ui/CartButton";
import AddressPopupWindow from "@/component/home/AddressPopupWindow";
import AddressNotServicable from "@/component/home/AddressNotServicable";
import Loader from "@/component/ui/Loader";
import Footer from "@/component/layout/Footer";

export default function HomePage() {
  /* ---------------- CORE STATE ---------------- */
  const [loginStatus, setLoginStatus] = useState<boolean | null>(null);
  const [addressList, setAddressList] = useState<any[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number} | null>(
    null,
  );
  const[userAddress,setUserAddress]=useState<{ title?: string; addressLine1?: string; addressLine2?: string} | null>(
    null,
  );

  /* ---------------- UI STATE ---------------- */
  const [isAddressPopupVisible, setIsAddressPopupVisible] = useState(true);
  const [ready, setReady] = useState(false);

  /* ---------------- DELIVERY STATE ---------------- */
  const [nearestWarehouse, setNearestWarehouse] = useState<any>(null);
  const [isAddressServable, setIsAddressServable] = useState(false);
  const [eta, setEta] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  /* ---------------- PRODUCTS ---------------- */
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  /* ======================================================
     INITIAL LOAD → CHECK LOGIN
  ====================================================== */

  useEffect(() => {
    fetchProfile();
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  async function fetchProfile() {
    // console.log("running fetchprofile");
    
    try {

      const res = await axios.get(
        process.env.NEXT_PUBLIC_API_ONE_BASE + "/customer/profile",
        { withCredentials: true },
      );

      if (res.data.success) {
        setLoginStatus(true);
        setAddressList(res.data.user.address || []);
        const addressPresentInLocalStorage = fetchLocationFromLocalStorage();
        // console.log("Address present in localStorage:", addressPresentInLocalStorage);
        if (!addressPresentInLocalStorage) {
          setIsAddressPopupVisible(true);
        }
        
      } else {
        console.error("Profile fetch failed:");
        setLoginStatus(false);
        let addressPresentInLocalStorage = fetchLocationFromLocalStorage();
        console.log("Address present in localStorage:", addressPresentInLocalStorage);
        if (!addressPresentInLocalStorage) {
          setIsAddressPopupVisible(true);}
      }
    } catch (err) {
      console.error("Profile fetch failed:", err);
      setLoginStatus(false);
       let addressPresentInLocalStorage = fetchLocationFromLocalStorage();
        console.log("Address present in localStorage:", addressPresentInLocalStorage);
        if (!addressPresentInLocalStorage) {
          setIsAddressPopupVisible(true);}
    } finally {
      // popup must open initially
      
    }
  }

  /* ======================================================
     ADDRESS SELECTION
  ====================================================== */

  function handleAddressSelect(addr: any) {
    // IMPORTANT: addr must contain lat/lng
    console.log("Selected address:", addr);

    setLocation({
      lat: addr.coordinates[1],
      lng: addr.coordinates[0],
    });
    setUserAddress({
      title:addr.title,
      addressLine1:addr.addressLine1,
      addressLine2:addr.addressLine2,
    });

    localStorage.setItem(
      "user_selected_address",
      JSON.stringify({ lat: addr.coordinates[1], lng: addr.coordinates[0]  ,title: addr.title,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2,}),
    );

    setIsAddressPopupVisible(false);
  }

  function getCurrentLocation() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const address = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          title:"Current Location",
          addressLine1:"",
          addressLine2:"",
        };

        setLocation({
          lat: address.lat,
          lng: address.lng,
        });
        setUserAddress({
          title:"Current Location",
          addressLine1:"",
          addressLine2:"",
        })
        localStorage.setItem(
          "user_selected_address",
          JSON.stringify(address),
        );
        setIsAddressPopupVisible(false);
      },
      (err) => console.error("Location error:", err),
      { enableHighAccuracy: true },
    );
  }

  function fetchLocationFromLocalStorage(): boolean {
  const stored = localStorage.getItem("user_selected_address");
  if (!stored) return false;
  try {
    // console.log("Stored coords:", stored);
    const coords = JSON.parse(stored);
    // console.log("Parsed coords:", coords);
    if (coords?.lat && coords?.lng ) {
      setLocation(coords);
      // setUserAddress({
      //   title?:coords.title,
      //   addressLine1?:coords.addressLine1,
      //   addressLine2:?coords.addressLine2,
      // }),
       setIsAddressPopupVisible(false);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}


  useEffect(() => {
    fetchLocationFromLocalStorage();
  }, []);


  /* ======================================================
     NEAREST WAREHOUSE
  ====================================================== */

  useEffect(() => {
    if (!location) return;

    (async () => {
      try {
        const res = await axios.post(
          process.env.NEXT_PUBLIC_API_ONE_BASE + "/customers/nearest-store",
          { user_coordinates: location },
        );

        if (res.data.success) {
          setNearestWarehouse(res.data.store);
          setIsAddressServable(true);
        } else {
          setNearestWarehouse(null);
          setIsAddressServable(false);
        }
      } catch {
        setNearestWarehouse(null);
        setIsAddressServable(false);
      }
    })();
  }, [location]);





  /* ======================================================
     ETA / DISTANCE
  ====================================================== */

  useEffect(() => {
    if (!location || !nearestWarehouse) return;

    fetch(
      `https://router.project-osrm.org/route/v1/foot/${location.lng},${location.lat};${nearestWarehouse.location.coordinates[0]},${nearestWarehouse.location.coordinates[1]}?overview=false`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.routes?.length) {
          setDistance(
            parseFloat((data.routes[0].distance / 1000).toFixed(2)),
          );
          setEta(Math.ceil(data.routes[0].duration / 60));
        }
      })
      .catch(console.error);
  }, [location, nearestWarehouse]);

  /* ======================================================
     PRODUCTS
  ====================================================== */

  useEffect(() => {
    if (!location || !isAddressServable) return;

    axios
      .get(
        process.env.NEXT_PUBLIC_API_ONE_BASE +
          "/customer/featured-products",
        { withCredentials: true },
      )
      .then((res) => setProducts(res.data.products))
      .finally(() => setProductsLoading(false));
  }, [location, isAddressServable]);

  /* ======================================================
     RENDER
  ====================================================== */

  if (!ready) return <Loader />;

  return (
    <div className="min-h-screen bg-white text-black">
      <Header
        address={userAddress}
        iswarehouse_present={!!nearestWarehouse}
        eta={eta}
        distance={distance}
        address_viewMode
        isLogedIn={!!loginStatus}
        onChangeCurrentAddress={() => setIsAddressPopupVisible(true)}
      />

      {isAddressPopupVisible && (
        <AddressPopupWindow
          userAddress={loginStatus ? addressList : []}
          onSelect={handleAddressSelect}
          onClose={() => {}}
          onCurrentLocationSelect={getCurrentLocation}
        />
      )}

      {isAddressServable ? (
        <>
          <HomeSearch />
          <BannerImage />
          <CartButton />

          <main className="pb-24 px-4">
            <h2 className="mb-4 text-xl font-bold">Popular near you</h2>

            {productsLoading ? (
              <ProductSkeleton />
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </main>

          <Footer />
        </>
      ) : (
        location && <AddressNotServicable />
      )}
    </div>
  );
}
