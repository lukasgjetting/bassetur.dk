import { useState } from "react";
import useCart from "../useCart";
import useUserName from "../useUserName";
import { trpc } from "@/lib/trpc";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import OrderHistoryModal from "./OrderHistoryModal";
import SelectIceCreamModal from "./SelectIceCreamModal";

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
  const [userName, setUserName] = useUserName();

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isIceCreamModalOpen, setIsIceCreamModalOpen] = useState(false);

  return (
    <div className="flex justify-between items-center bg-green-suit text-white p-4">
      <div className="flex flex-col">
        <button
          className="flex items-center gap-2 p-2 -m-2"
          onClick={() => {
            if (confirm("Vil du logge ud?")) {
              setUserName("");
            }
          }}
        >
          Hej {userName}!{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
            fill="white"
            className="w-4 h-4 rotate-90 relative bottom-0.5"
          >
            <path d="M299.3 244.7c6.2 6.2 6.2 16.4 0 22.6l-192 192c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6L265.4 256 84.7 75.3c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0l192 192z" />
          </svg>
        </button>
      </div>
      <div className="flex gap-2 items-center">
        <button
          className="hover:bg-green-dust/25 text-sm text-white p-2 rounded-lg"
          onClick={() => {
            setIsIceCreamModalOpen(true);
          }}
        >
          Vælg is
        </button>
        <button
          className="bg-green-dust text-green-suit px-3 py-2 text-xs rounded-lg"
          onClick={() => {
            setIsHistoryModalOpen(true);
          }}
        >
          Historik
        </button>
      </div>
      <OrderHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />
      <SelectIceCreamModal
        isOpen={isIceCreamModalOpen}
        onClose={() => setIsIceCreamModalOpen(false)}
      />
    </div>
  );
};

export default Header;
