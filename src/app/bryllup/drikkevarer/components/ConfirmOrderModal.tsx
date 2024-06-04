"use client";
import { Transition } from "@headlessui/react";
import Confetti, { ConfettiConfig } from "react-dom-confetti";
import useCart from "../useCart";
import Image from "next/image";
import { trpc } from "@/lib/trpc";
import classNames from "classnames";
import useUserName from "../useUserName";

const confettiConfig: ConfettiConfig = {
  duration: 8000,
  elementCount: 400,
  spread: 100,
};

type ConfirmOrderModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const ConfirmOrderModal: React.FC<ConfirmOrderModalProps> = ({
  isVisible,
  onClose,
}) => {
  const [userName] = useUserName();
  const [cart, { addToCart, removeFromCart, clearCart }] = useCart();
  const createOrderMutation = trpc.beverage.createBeverageOrder.useMutation({
    onSuccess: () => {
      setTimeout(() => {
        onClose();
        clearCart();
        createOrderMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  let buttonLabel = "Bestil";

  if (createOrderMutation.isPending) {
    buttonLabel = "Vent venligst...";
  } else if (createOrderMutation.isSuccess) {
    buttonLabel = "Modtaget! 🎉";
  }

  return (
    <>
      <Transition
        show={isVisible}
        enter="transition duration-500"
        enterFrom="opacity-0 translate-y-32"
        enterTo="opacity-100 translate-y-0"
        leave="transition duration-500"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-32"
        as="div"
        className="fixed inset-0 flex flex-col justify-end items-center z-50"
      >
        <div className="absolute -inset-32 bg-black/20 z-0" onClick={onClose} />
        <div className="z-10 bg-white border p-4 w-full rounded-tr-3xl rounded-tl-3xl">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Bekræft din bestilling</h1>
            <div className="w-4"></div>
            <button
              onClick={onClose}
              className="text-2xl text-white font-bold w-8 h-8 rounded-full bg-green-suit"
            >
              x
            </button>
          </div>
          <div className="h-8" />
          <div className="flex flex-col gap-4">
            {cart.items.map((item) => (
              <div
                key={item.beverage.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Image
                    alt=""
                    src={item.beverage.imageSourceUrl}
                    width={50}
                    height={50}
                  />
                  <span>{item.beverage.name}</span>
                </div>
                <div className="flex gap-1 items-center">
                  <button
                    onClick={() => removeFromCart(item.beverage.id)}
                    className="bg-green-suit text-white h-8 w-8 font-bold text-lg rounded-full"
                  >
                    -
                  </button>
                  <span className="w-6 h-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => addToCart(item.beverage)}
                    className="bg-green-suit text-white h-8 w-8 font-bold text-lg rounded-full"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="h-8" />
          <button
            disabled={
              createOrderMutation.isPending || createOrderMutation.isSuccess
            }
            className={classNames(
              "text-white p-4 w-full transition text-2xl shadow-xl rounded-full text-center font-bold",
              createOrderMutation.isPending && "opacity-50",
              createOrderMutation.isSuccess ? "bg-green-600" : "bg-green-dust",
            )}
            onClick={() =>
              createOrderMutation.mutate({
                userName,
                beverages: cart.items.map((item) => ({
                  beverageId: item.beverage.id,
                  quantity: item.quantity,
                })),
              })
            }
          >
            {buttonLabel}
          </button>
          <div className="flex justify-center relative z-50">
            <Confetti
              active={createOrderMutation.isSuccess}
              config={confettiConfig}
            />
          </div>
          <div className="h-4" />
        </div>
      </Transition>
    </>
  );
};

export default ConfirmOrderModal;
