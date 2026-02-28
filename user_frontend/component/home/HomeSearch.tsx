"use client";

import React, { useEffect } from "react";
import SearchLauncher from "..//searchLauncher";
import { useState } from "react";


type HomeSearchProps = {
  homesearch_styra?: string;
};

export default function HomeSearch({
  homesearch_styra = "",
}: HomeSearchProps) {

  const defaultClass =
    "transition-all duration-300 px-4 py-4 mx-auto ";

  return (
    <section className={`${defaultClass} ${homesearch_styra}`}>
      <SearchLauncher />
    </section>
  );
}