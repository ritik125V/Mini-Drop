"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const nav = [
  { href: "/dashboard", label: "dashboard" },
  { href: "/inventory", label: "inventory" },
  { href: "/orders", label: "Orders" },
  { href: "/cart", label: "Cart" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header style={{ borderBottom: "1px solid #ddd", padding: "10px 16px" }}>
      <nav style={{ display: "flex", gap: 12 }}>
        {nav.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: "none",
                color: isActive ? "#CED656" : "#666",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
