import { useState } from "react";
import useCart from "../useCart";
import useUserName from "../useUserName";
import { trpc } from "@/lib/trpc";
import { Transition } from "@headlessui/react";
import Image from "next/image";

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
  const [userName, setUserName] = useUserName();

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const historyQuery = trpc.beverage.getPreviousOrders.useQuery({ userName });

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
            setIsHistoryModalOpen(true);
            historyQuery.refetch();
          }}
        >
          Vælg is
        </button>
        <button
          className="bg-green-dust text-green-suit px-3 py-2 text-xs rounded-lg"
          onClick={() => {
            setIsHistoryModalOpen(true);
            historyQuery.refetch();
          }}
        >
          Historik
        </button>
      </div>
      <Transition
        show={isHistoryModalOpen}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        as="div"
        className="fixed inset-0 overflow-y-auto bg-green-suit/80 p-4 z-50"
      >
        <div className="flex items-center justify-between">
          <h4 className="text-2xl font-bold">Tidligere bestillinger</h4>
          <button
            className="text-2xl text-green-suit font-bold w-8 h-8 rounded-full bg-green-dust"
            onClick={() => setIsHistoryModalOpen(false)}
          >
            x
          </button>
        </div>
        <div className="flex flex-col-reverse">
          {historyQuery.data != null && historyQuery.data.length > 0 ? (
            [...historyQuery.data].reverse().map((o, index) => (
              <div key={o.id} className="pt-8">
                <div className="flex items-center justify-between">
                  <h5 className="text-lg font-bold">Bestilling {index + 1}</h5>
                  <div>
                    {new Date(o.createdAt).getHours()}:
                    {new Date(o.createdAt).getMinutes()}
                  </div>
                </div>
                <div className="h-2" />
                <div className="flex flex-col gap-4">
                  {o.orderLines.map((ol) => (
                    <div
                      key={ol.beverage.id}
                      className="flex items-center gap-2"
                    >
                      <div>
                        {ol.beverage.name} x {ol.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">Ingen tidligere bestillinger</div>
          )}
        </div>
      </Transition>
    </div>
  );
};

export default Header;
