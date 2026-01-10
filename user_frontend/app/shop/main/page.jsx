"use client";

import dynamic from "next/dynamic";

const ClientMap = dynamic(() => import("../../../component/ClientMap.jsx"), {
  ssr: false, // 🔥 REQUIRED
});

export default function Page() {
  return <ClientMap />;
}
