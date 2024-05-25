"use client";

import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import MainBeverageScreen from "./MainBeverageScreen";
import classNames from "classnames";
import Image from "next/image";
import { comfortaa, fonts, rosabelia } from "@/utils/fonts";

const Drikkevarer = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2500);
  }, []);

  return (
    <div style={fonts.comfortaa.style}>
      {!isLoading && <MainBeverageScreen />}
      <div
        className={classNames(
          "fixed inset-0 p-4 bg-white flex flex-col gap-8 justify-center items-center transition duration-1000",
          isLoading
            ? "translate-y-0"
            : "translate-y-[150vh] pointer-events-none",
        )}
      >
        <Image
          alt=""
          src="/images/bassebryllup-klistermærke.png"
          width={250}
          height={250}
        />
        <h1
          style={rosabelia.style}
          className="font-normal text-6xl text-center text-bassebrun"
        >
          Velkommen til
          <br />
          vores bryllup <span className="text-3xl">🥹</span>
        </h1>
        <span style={comfortaa.style} className="opacity-75 text-bassebrun">
          Vent venligst...
        </span>
        <div className="h-16"></div>
      </div>
    </div>
  );
};

export default trpc.withTRPC(Drikkevarer);
