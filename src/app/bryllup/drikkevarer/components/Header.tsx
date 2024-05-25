import { useState } from "react";
import useCart from "../useCart";
import useUserName from "../useUserName";
import { trpc } from "@/lib/trpc";
import { Transition } from "@headlessui/react";
import Image from "next/image";

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
  const [userName] = useUserName();
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const historyQuery = trpc.beverage.getPreviousOrders.useQuery({ userName });

  return (
    <div className="flex justify-between items-center bg-purple-800 text-purple-50 p-4">
      <h1>Hej {userName}!</h1>
      <div>
        <button
          className="bg-purple-700 text-purple-50 p-2 rounded-lg"
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
        className="fixed inset-0 overflow-y-auto bg-purple-800/80 p-4 z-10"
      >
        <h4 className="text-2xl font-bold">Tidligere bestillinger</h4>
        <button onClick={() => setIsHistoryModalOpen(false)}>Luk</button>
        {historyQuery.data?.map((o) => (
          <div key={o.id} className="">
            <h5>
              {new Date(o.createdAt).getHours()}:
              {new Date(o.createdAt).getMinutes()}
            </h5>
            <div className="flex flex-col gap-4">
              {o.orderLines.map((ol) => (
                <div key={ol.beverage.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 relative">
                    <Image src={ol.beverage.imageSourceUrl} alt="" fill />
                  </div>
                  <div>
                    {ol.beverage.name} x {ol.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Transition>
    </div>
  );
};

export default Header;
