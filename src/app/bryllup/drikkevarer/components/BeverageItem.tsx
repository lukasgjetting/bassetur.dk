import { fonts } from "@/utils/fonts";
import useCart, { CartBeverage } from "../useCart";
import classNames from "classnames";

type BeverageItemProps = {
  beverage: CartBeverage;
};

const BeverageItem: React.FC<BeverageItemProps> = ({ beverage }) => {
  const [cart, { addToCart, removeFromCart }] = useCart();

  const isInCart = cart.items.some((i) => i.beverage.id === beverage.id);

  return (
    <div className="w-full bg-cream relative pr-16 pl-6 py-8 border-b border-b-green-dust overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/beverage-top-left.png"
        className="absolute z-0 left-0 top-0 w-1/3"
        alt=""
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/beverage-bottom-right.png"
        className="absolute z-0 right-1 top-4 w-1/2"
        alt=""
      />
      <div className="relative z-10">
        <div style={fonts.dancing.style} className="text-4xl text-bassebrun">
          {beverage.name}
        </div>
        <div className="flex flex-col">
          {beverage.ingredients.map((ingredient) => (
            <div
              key={ingredient}
              className="mt-1 text-sm flex items-center gap-2 font-light text-slate-800"
            >
              <span className="text-[#D3AD29] text-xs">—</span>
              {ingredient}
            </div>
          ))}
        </div>
        <div
          className={classNames(
            "absolute -right-10 flex justify-center items-center",
            beverage.ingredients.length > 0 ? "bottom-0" : "top-0 bottom-0 ",
          )}
        >
          {isInCart && (
            <>
              <button
                onClick={() => removeFromCart(beverage.id)}
                className="p-2"
              >
                <div className="bg-green-suit text-white h-10 w-10 flex justify-center items-center shadow-xl rounded-full">
                  <svg
                    width="20"
                    height="20"
                    viewBox="-1 -1 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 10L0 10"
                      stroke="#FFFEEE"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
              </button>
              <div className="w-10 h-10 rounded flex justify-center items-center bg-white border text-bassebrun text-xl font-bold shadow-xl">
                {
                  cart.items.find((item) => item.beverage.id === beverage.id)
                    ?.quantity
                }
              </div>
            </>
          )}
          <button onClick={() => addToCart(beverage)} className="p-2">
            <div className="bg-green-suit text-white h-10 w-10 flex justify-center items-center shadow-xl rounded-full">
              <svg
                width="20"
                height="20"
                viewBox="-1 -1 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 0L10 20"
                  stroke="#FFFEEE"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M20 10L0 10"
                  stroke="#FFFEEE"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeverageItem;
