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

function MainBeverageScreen() {
  const [userName, setUserName, logOut] = useUserName();

  const [cart, { addToCart, removeFromCart, numberOfItemsInCart }] = useCart();

  const [isConfirmOrderModalOpen, setIsConfirmOrderModalOpen] = useState(false);

  const beverageIdsInCart = new Set(cart.items.map((item) => item.beverage.id));
  const beveragesQuery = trpc.beverage.getBeverages.useQuery();

  const beveragesById =
    beveragesQuery.data?.reduce(
      (acc, b) => {
        acc[b.id] = b;
        return acc;
      },
      {} as Record<string, CartBeverage>,
    ) ?? {};

  if (userName === "") {
    return <SignInView onSignIn={(userName) => setUserName(userName)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex flex-wrap pb-24">
        {beveragesQuery.data?.map((b) => (
          <BeverageItem key={b.id} beverage={b} />
        ))}
      </div>
      <button onClick={() => logOut()}>log ud</button>
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
