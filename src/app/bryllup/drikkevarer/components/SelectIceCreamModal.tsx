import { trpc } from "@/lib/trpc";
import { Transition } from "@headlessui/react";
import useUserName from "../useUserName";
import { useEffect, useState } from "react";
import iceCreamOptions from "@/utils/iceCreamOptions";

type SelectIceCreamModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SelectIceCreamModal: React.FC<SelectIceCreamModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [userName] = useUserName();
  const iceCreamSelectionQuery = trpc.iceCream.getSelection.useQuery({
    userName,
  });

  const [isDirty, setIsDirty] = useState(false);
  const [iceCreamSelection, setIceCreamSelection] = useState<string[]>([]);

  const saveSelectionMutation = trpc.iceCream.setSelection.useMutation({
    onSuccess: () => {
      iceCreamSelectionQuery.refetch();
      setIsDirty(false);

      alert("Dit valg er gemt!");

      onClose();
    },
  });

  useEffect(() => {
    if (isDirty) {
      return;
    }

    setIceCreamSelection(iceCreamSelectionQuery.data ?? []);
  }, [iceCreamSelectionQuery.data, isDirty]);

  const [
    first = "Overrask mig",
    second = "Overrask mig",
    backup = "Overrask mig",
  ] = iceCreamSelection;

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
        <h4 className="text-2xl font-bold">Vælg is</h4>
        <button
          className="text-2xl text-green-suit font-bold w-8 h-8 rounded-full bg-green-dust"
          onClick={() => {
            if (
              !isDirty ||
              confirm(
                "Du mangler vist at gemme, er du sikker på at du vil gå tilbage?",
              )
            ) {
              onClose();
              setIsDirty(false);
              setIceCreamSelection(iceCreamSelectionQuery.data ?? []);
            }
          }}
        >
          x
        </button>
      </div>
      <div className="h-4" />
      <div className="flex flex-col gap-0.5">
        Første kugle
        <select
          className="text-black px-3 py-3 rounded-lg"
          value={first}
          onChange={(e) => {
            const value = e.target.value;
            setIsDirty(true);
            setIceCreamSelection((oldValue) => {
              const newValue = [...oldValue];
              newValue[0] = value;

              return newValue;
            });
          }}
        >
          {iceCreamOptions.map((iceCream) => (
            <option key={iceCream} value={iceCream}>
              {iceCream}
            </option>
          ))}
        </select>
      </div>
      <div className="h-6" />
      <div className="flex flex-col gap-0.5">
        Anden kugle
        <select
          className="text-black px-3 py-3 rounded-lg"
          value={second}
          onChange={(e) => {
            const value = e.target.value;
            setIsDirty(true);
            setIceCreamSelection((oldValue) => {
              const newValue = [...oldValue];
              newValue[1] = value;

              return newValue;
            });
          }}
        >
          {iceCreamOptions.map((iceCream) => (
            <option key={iceCream} value={iceCream}>
              {iceCream}
            </option>
          ))}
        </select>
      </div>
      <div className="h-6" />
      <div className="flex flex-col gap-0.5">
        Backup
        <span className="text-sm italic opacity-80">
          Hvis vi løber tør for en af dine valgte kugler
        </span>
        <div className="h-1"></div>
        <select
          className="text-black px-3 py-3 rounded-lg"
          value={backup}
          onChange={(e) => {
            const value = e.target.value;
            setIsDirty(true);
            setIceCreamSelection((oldValue) => {
              const newValue = [...oldValue];
              newValue[2] = value;

              return newValue;
            });
          }}
        >
          {iceCreamOptions.map((iceCream) => (
            <option key={iceCream} value={iceCream}>
              {iceCream}
            </option>
          ))}
        </select>
        <div className="h-6" />
        <button
          className="bg-green-dust rounded-full py-3 px-12 self-center text-xl text-green-suit-dark"
          onClick={() => {
            saveSelectionMutation.mutate({
              userName,
              iceCreamSelection: iceCreamSelection,
            });
          }}
        >
          {saveSelectionMutation.isPending ? "Gemmer..." : "Gem"}
        </button>
      </div>
    </Transition>
  );
};

export default SelectIceCreamModal;
