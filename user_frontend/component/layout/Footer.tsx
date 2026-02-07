"use client";
import React from "react";
import Link from "next/link";
import logo from "../../resources/logos/MD-logo_transparent_bg.png";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Package,
  User,
  ShoppingCart,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";

function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-semibold text-black">
              <Image
                src={logo}
                alt="minidrop logo"
                width={32}
                height={32}
                className="inline mr-2"
              />{" "}
              minidrop ⚡
            </h2>

            <p className="text-sm text-gray-500 mt-2 max-w-xs">
              quick commerce for lazy{" "}
              <motion.span
                whileHover={{
                  scale: 1.25,
                  rotate: -6,
                  fontWeight: 700,
                }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 14,
                }}
                className="inline-block text-red-400 cursor-default"
              >
                legends
              </motion.span>
              .
              <br />
              cool stuff, delivered fast.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-14 text-sm">
            {/* Explore */}
            <div className="flex flex-col gap-3">
              <span className="text-gray-400 uppercase text-xs tracking-wide">
                explore
              </span>

              <FooterLink href="/shop/home" icon={ShoppingBag}>
                shop
              </FooterLink>

              <FooterLink href="/shop/search" icon={Search}>
                search
              </FooterLink>

              <FooterLink href="/shop/orders" icon={Package}>
                orders
              </FooterLink>
            </div>

            {/* Account (intentionally louder) */}
            <div className="flex flex-col gap-3">
              <span className="uppercase text-xs tracking-wide font-semibold text-red-400">
                account
              </span>

              <FooterLink href="/shop/account" icon={User}>
                profile
              </FooterLink>

              <FooterLink href="/shop/cart" icon={ShoppingCart}>
                cart
              </FooterLink>

              <FooterLink href="/shop/checkout" icon={CreditCard}>
                checkout
              </FooterLink>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} minidrop. built for genz.</p>

          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-red-400 transition">
              privacy
            </span>
            <span className="cursor-pointer hover:text-red-400 transition">
              terms
            </span>
            <span className="cursor-pointer hover:text-red-400 transition">
              support
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------
   Reusable footer link
-------------------------- */

function FooterLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 text-gray-600 hover:text-black transition"
    >
      <span>{children}</span>

      <Icon
        size={14}
        className="
          text-red-400
          opacity-0
          -translate-x-1
          group-hover:opacity-100
          group-hover:translate-x-0
          transition-all
          duration-200
        "
      />
    </Link>
  );
}

export default Footer;
