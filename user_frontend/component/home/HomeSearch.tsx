"use client";

import React from "react";
import SearchLauncher from "..//searchLauncher";


type HomeSearchProps = {
  style?:{
    backgroundColor?: string;
    color?: string;
    [key: string]: any;
  }
}
export default function HomeSearch( props: HomeSearchProps ) {
  return (
    <section className="px-4 py-4  mx-auto border">
      <SearchLauncher />
    </section>
  );
}
