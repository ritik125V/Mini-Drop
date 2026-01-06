"use client";

import Snowfall from "react-snowfall";
export default function Home() {
  return (
    <div className=" text-white flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Snowfall snowflakeCount={8} color="#BA5A45" style={{ background: "transparent" }} />
      <div>hello world
        <h1 className="text-white">hello</h1>
      </div>
    </div>
  );
}
