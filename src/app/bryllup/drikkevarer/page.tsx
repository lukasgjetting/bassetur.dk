"use client";

import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import MainBeverageScreen from "./MainBeverageScreen";
import classNames from "classnames";
import Image from "next/image";

const Drikkevarer = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2500);
  }, []);

  return (
    <div>
      {!isLoading && <MainBeverageScreen />}
      <div
        className={classNames(
          "fixed inset-0 p-4 bg-purple-800 flex flex-col gap-8 justify-center items-center transition duration-1000",
          isLoading
            ? "translate-y-0"
            : "translate-y-[150vh] pointer-events-none",
        )}
      >
        <Image
          alt=""
          src="/images/bassebryllup-klistermærke.png"
          width={200}
          height={200}
        />
        <h1 className="text-white font-bold text-4xl text-center">
          Velkommen til vores bryllup 🥹
        </h1>
        <span className="text-white/75">Vent venligst...</span>
        <div className="h-16"></div>
      </div>
    </div>
  );
};

export default trpc.withTRPC(Drikkevarer);
