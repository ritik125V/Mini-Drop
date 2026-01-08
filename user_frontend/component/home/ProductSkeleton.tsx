"use client";

import React from "react";

export default function ProductSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="h- rounded-xl bg-neutral-100 animate-pulse"
        />
      ))}
    </div>
  );
}
