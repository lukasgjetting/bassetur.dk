import { Transition } from "@headlessui/react";
import useCart from "../useCart";
import Image from "next/image";
import { trpc } from "@/lib/trpc";
import classNames from "classnames";

type ConfirmOrderModalProps = {
  userName: string;
  isVisible: boolean;
  onClose: () => void;
};

const ConfirmOrderModal: React.FC<ConfirmOrderModalProps> = ({
  isVisible,
  onClose,
  userName,
}) => {
  const [cart, { addToCart, removeFromCart, clearCart }] = useCart();
  const createOrderMutation = trpc.beverage.createBeverageOrder.useMutation({
    onSuccess: () => {
      setTimeout(() => {
        onClose();
        clearCart();
        createOrderMutation.reset();
      }, 3000);
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
    <Transition
      show={isVisible}
      enter="transition duration-500"
      enterFrom="opacity-0 translate-y-4"
      enterTo="opacity-100 translate-y-0"
      leave="transition duration-500"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 -translate-y-4"
      as="div"
      className="fixed inset-0 bg-purple-800/80 flex justify-center items-center p-4"
    >
      <div className="bg-white border p-4">
        <h1 className="text-2xl font-bold">Bekræft din ordre</h1>
        <div className="h-4" />
        <div className="flex flex-col gap-4">
          {cart.items.map((item) => (
            <div
              key={item.beverage.id}
              className="flex items-center justify-between"
            >
              <Image
                alt=""
                src={item.beverage.imageSourceUrl}
                width={50}
                height={50}
              />
              <span>{item.beverage.name}</span>
              <div className="flex gap-1 items-center">
                <button
                  onClick={() => removeFromCart(item.beverage.id)}
                  className="bg-purple-800 text-white h-6 w-6 rounded-full"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => addToCart(item.beverage)}
                  className="bg-purple-800 text-white h-6 w-6 rounded-full"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="h-4" />
        <button
          disabled={
            createOrderMutation.isPending || createOrderMutation.isSuccess
          }
          className={classNames(
            "text-white p-4 w-full rounded-lg transition",
            createOrderMutation.isPending && "opacity-50",
            createOrderMutation.isSuccess ? "bg-green-600" : "bg-purple-800",
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
        <button onClick={onClose}>Luk</button>
      </div>
    </Transition>
  );
};

export default ConfirmOrderModal;
