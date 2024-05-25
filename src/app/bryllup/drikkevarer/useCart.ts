import { AppRouter } from "@/server/routers/_app";
import { inferProcedureOutput } from "@trpc/server";
import { useLocalStorage } from "usehooks-ts";

export type Beverage = inferProcedureOutput<
  AppRouter["beverage"]["getBeverages"]
>[number];

export type Cart = {
  items: Array<{
    beverage: Beverage;
    quantity: number;
  }>;
};

const useCart = () => {
  const [cart, setCart, clearCart] = useLocalStorage<Cart>(
    "cart",
    { items: [] },
    {
      serializer: JSON.stringify,
      deserializer: JSON.parse,
    },
  );

  const addToCart = (beverage: Beverage) => {
    if (cart.items.some((item) => item.beverage.id === beverage.id)) {
      setCart({
        items: cart.items.map((item) =>
          item.beverage.id === beverage.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        ),
      });
    } else {
      setCart({
        items: [
          ...cart.items,
          {
            beverage,
            quantity: 1,
          },
        ],
      });
    }
  };

  const removeFromCart = (beverageId: string) => {
    const existingItem = cart.items.find(
      (item) => item.beverage.id === beverageId,
    );

    if (existingItem == null) {
      return;
    }

    if (existingItem.quantity === 1) {
      setCart({
        items: cart.items.filter((item) => item.beverage.id !== beverageId),
      });
    } else {
      setCart({
        items: cart.items.map((item) =>
          item.beverage.id === beverageId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        ),
      });
    }
  };

  const numberOfItemsInCart = cart.items.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  return [
    cart,
    { addToCart, removeFromCart, clearCart, numberOfItemsInCart },
  ] as const;
};

export default useCart;
