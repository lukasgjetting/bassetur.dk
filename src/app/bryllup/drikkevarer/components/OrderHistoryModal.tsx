import { Transition } from "@headlessui/react";
import useUserName from "../useUserName";
import { trpc } from "@/lib/trpc";

type OrderHistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [userName] = useUserName();
  const historyQuery = trpc.beverage.getPreviousOrders.useQuery({ userName });

  return (
    <Transition
      show={isOpen}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      as="div"
      className="fixed inset-0 overflow-y-auto bg-green-suit p-4 z-50"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-2xl font-bold">Tidligere bestillinger</h4>
        <button
          className="text-2xl text-green-suit font-bold w-8 h-8 rounded-full bg-green-dust"
          onClick={() => onClose()}
        >
          x
        </button>
      </div>
      <div className="flex flex-col-reverse">
        {historyQuery.data != null && historyQuery.data.length > 0 ? (
          [...historyQuery.data].reverse().map((o, index) => (
            <div key={o.id} className="pt-8">
              <div className="flex items-center justify-between">
                <h5 className="text-lg font-bold text-green-dust">
                  Bestilling {index + 1}
                </h5>
                <div>
                  {new Date(o.createdAt).getHours()}:
                  {new Date(o.createdAt).getMinutes()}
                </div>
              </div>
              <div className="h-2" />
              <div className="flex flex-col gap-1">
                {o.orderLines.map((ol) => (
                  <div key={ol.beverage.id} className="flex items-center gap-2">
                    <div>
                      {ol.beverage.name} x {ol.quantity}
                    </div>
                  </div>
                ))}
              </div>
              {index > 0 && <div className="mt-8 -mx-8 h-px bg-white/25" />}
            </div>
          ))
        ) : (
          <div className="text-center py-8">Ingen tidligere bestillinger</div>
        )}
      </div>
    </Transition>
  );
};

export default OrderHistoryModal;
