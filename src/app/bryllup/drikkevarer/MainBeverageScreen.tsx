"use client";
import { useLocalStorage } from "usehooks-ts";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import SignInView from "./components/SignInView";
import Header from "./components/Header";
import Image from "next/image";
import classNames from "classnames";
import useCart, { CartBeverage } from "./useCart";
import ConfirmOrderModal from "./components/ConfirmOrderModal";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "@/server/routers/_app";
import useUserName from "./useUserName";
import BeverageItem from "./components/BeverageItem";
import { BeverageType } from "@prisma/client";

const categoryLabels: Record<BeverageType, string> = {
  WINE: "Vin",
  COCKTAIL: "Cocktails",
  BEER: "Øl",
  SODA: "Sodavand",
  WATER: "Vand",
};

function MainBeverageScreen() {
  const [userName, setUserName] = useUserName();

  const [cart, { addToCart, removeFromCart, numberOfItemsInCart }] = useCart();

  const [isConfirmOrderModalOpen, setIsConfirmOrderModalOpen] = useState(false);

  const beveragesQuery = trpc.beverage.getBeverages.useQuery();

  if (userName === "") {
    return <SignInView onSignIn={(userName) => setUserName(userName)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex gap-4 justify-center w-full flex-wrap pt-6 pb-6 bg-cream">
        {Object.keys(categoryLabels).map((category) => (
          <a
            key={category}
            className="py-2 px-6 rounded-full bg-purple-200 shadow"
            href={`#category-${category}`}
          >
            {categoryLabels[category as BeverageType]}
          </a>
        ))}
      </div>
      {Object.keys(categoryLabels).map((category) => {
        const beverages =
          beveragesQuery.data?.filter((b) => b.type === category) ?? [];

        if (beverages.length === 0) {
          return null;
        }

        return (
          <div key={category} className="w-full">
            <h3
              className="text-2xl font-bold text-center py-4 bg-green-suit-dark text-cream"
              id={`category-${category}`}
            >
              {categoryLabels[category as BeverageType]}
            </h3>
            <div className="flex flex-wrap">
              {beverages.map((b) => (
                <BeverageItem key={b.id} beverage={b} />
              ))}
            </div>
          </div>
        );
      })}
      <div className="h-32" />
      <button
        className={classNames(
          "fixed z-20 bottom-8 left-8 right-8 py-4 text-white bg-green-dust text-2xl shadow-xl rounded-full text-center font-bold transition",
          numberOfItemsInCart === 0
            ? "pointer-events-none translate-y-24"
            : "translate-y-0",
        )}
        onClick={() => setIsConfirmOrderModalOpen(true)}
      >
        Bestil ({numberOfItemsInCart})
      </button>
      <ConfirmOrderModal
        isVisible={isConfirmOrderModalOpen}
        onClose={() => setIsConfirmOrderModalOpen(false)}
      />
    </div>
  );
}

export default MainBeverageScreen;
