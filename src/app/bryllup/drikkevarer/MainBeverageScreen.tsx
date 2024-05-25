"use client";
import { useLocalStorage } from "usehooks-ts";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import SignInView from "./components/SignInView";
import Header from "./components/Header";
import Image from "next/image";
import classNames from "classnames";
import useCart, { Beverage } from "./useCart";
import ConfirmOrderModal from "./components/ConfirmOrderModal";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "@/server/routers/_app";
import useUserName from "./useUserName";

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
      {} as Record<string, Beverage>,
    ) ?? {};

  if (userName === "") {
    return <SignInView onSignIn={(userName) => setUserName(userName)} />;
  }

  return (
    <div className="min-h-screen bg-purple-500 text-purple-950">
      <Header />
      <div className="flex flex-wrap p-2">
        {beveragesQuery.data?.map((b) => (
          <div key={b.id} className="w-1/2 p-2">
            <div className="bg-white/25 rounded-lg shadow">
              <div className="rounded-lg relative overflow-hidden h-32">
                <Image alt="" src={b.imageSourceUrl} fill />
                <div className="absolute bottom-0 left-0 right-0 bg-purple-800/80 text-white text-center">
                  {b.name}
                </div>
                {beverageIdsInCart.has(b.id) ? (
                  <div className="absolute inset-0 flex justify-center items-center gap-2">
                    <button
                      onClick={() => removeFromCart(b.id)}
                      className="bg-purple-800 text-white h-6 w-6 rounded-full"
                    >
                      -
                    </button>
                    <div className="w-10 h-10 rounded-full flex justify-center items-center bg-black/75 text-white">
                      {
                        cart.items.find((item) => item.beverage.id === b.id)
                          ?.quantity
                      }
                    </div>
                    <button
                      onClick={() => addToCart(b)}
                      className="bg-purple-800 text-white h-6 w-6 rounded-full"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(b)}
                    className="absolute inset-0"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => logOut()}>log ud</button>
      <button
        className={classNames(
          "fixed bottom-8 left-8 right-8 py-4 bg-white border text-purple-800 shadow-xl rounded-lg text-center font-bold transition ",
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
