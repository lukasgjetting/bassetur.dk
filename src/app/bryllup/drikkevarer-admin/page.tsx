"use client";

import { trpc } from "@/lib/trpc";
import classNames from "classnames";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

const DrikkevarerAdminPage = () => {
  const ordersQuery = trpc.beverage.getOrders.useQuery(undefined, {
    refetchInterval: 5000,
  });
  const markOrderCompleteMutation = trpc.beverage.markOrderComplete.useMutation(
    {
      onSuccess: () => {
        ordersQuery.refetch();
      },
    },
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [openList, setOpenList] = useState<"new" | "history">("new");
  const [checkedIndexesByOrderId, setCheckedIndexesByOrderId] = useLocalStorage<
    Record<string, number[]>
  >(
    "checkedIndexesByOrderId",
    {},
    {
      serializer: JSON.stringify,
      deserializer: JSON.parse,
    },
  );

  const visibleOrders =
    ordersQuery.data?.filter(
      (o) => o.status === (openList === "new" ? "PENDING" : "COMPLETED"),
    ) || [];
  const selectedOrder = visibleOrders.find((o) => o.id === selectedOrderId);

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <div className="flex pt-4 px-4 gap-4 text-center">
          <button
            className={classNames(
              "flex-1 py-3 rounded-t-xl",
              openList === "new" ? "bg-green-suit text-white" : "bg-gray-200",
            )}
            onClick={() => setOpenList("new")}
          >
            Afventer
          </button>
          <button
            className={classNames(
              "flex-1 py-3 rounded-t-xl",
              openList === "history"
                ? "bg-green-suit text-white"
                : "bg-gray-200",
            )}
            onClick={() => setOpenList("history")}
          >
            Historik
          </button>
        </div>
        <div className="pt-4 bg-green-suit flex-1 overflow-y-auto">
          {visibleOrders.map((o, index) => {
            const cocktails = o.orderLines.filter(
              (l) => l.beverage.type === "COCKTAIL",
            );

            return (
              <div
                key={o.id}
                className={classNames(
                  "ml-4 pr-4",
                  o.id === selectedOrderId && "bg-green-dust",
                )}
              >
                <button
                  className={classNames(
                    "w-full text-left flex justify-between items-center px-2 py-3",
                    index !== visibleOrders.length - 1 ? "border-b" : "",
                    o.id === selectedOrderId ? "bg-green-dust" : "bg-white",
                  )}
                  onClick={() => setSelectedOrderId(o.id)}
                >
                  <div className="flex flex-col">
                    <div className="text-xl">Bord {o.user.tableNumber}</div>
                    <div className="text-sm italic text-green-suit">
                      {new Date(o.createdAt)
                        .getHours()
                        .toString()
                        .padStart(2, "0")}
                      :
                      {new Date(o.createdAt)
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div>
                      <span className="font-bold">
                        {o.orderLines.reduce((a, b) => a + b.quantity, 0)}{" "}
                      </span>
                      {o.orderLines.length === 1 &&
                      o.orderLines[0].quantity === 1
                        ? "drikkevare"
                        : "drikkevarer"}
                    </div>
                    {cocktails.length > 0 && (
                      <div className="flex flex-col gap-2">
                        {cocktails.map((c) => (
                          <div key={c.id} className="flex gap-2">
                            <div className="text-sm text-gray-500">
                              {c.beverage.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              x {c.quantity}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex-[2] bg-green-dust">
        {selectedOrder != null ? (
          <div className="p-8">
            <div className="text-center text-2xl">
              Bord {selectedOrder.user.tableNumber}
            </div>
            <div className="h-4" />
            <div className="rounded-lg bg-white">
              <table className="w-full">
                <thead>
                  <th className="px-4 py-2 w-12"></th>
                  <th className="px-4 py-2 text-left">Drikkevare</th>
                  <th className="px-4 py-2 w-12">Stk</th>
                </thead>
                <tbody>
                  {selectedOrder.orderLines.map((l, index) => {
                    const inputId = `checkbox-${selectedOrder.id}-${index}`;
                    return (
                      <tr key={l.id}>
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            id={inputId}
                            className="h-8 w-8 align-middle"
                            checked={
                              checkedIndexesByOrderId[
                                selectedOrder.id
                              ]?.includes(index) ?? false
                            }
                            onChange={(e) =>
                              setCheckedIndexesByOrderId((prev) => {
                                return {
                                  ...prev,
                                  [selectedOrder.id]: e.target.checked
                                    ? [...(prev[selectedOrder.id] ?? []), index]
                                    : (prev[selectedOrder.id] ?? []).filter(
                                        (i) => i !== index,
                                      ),
                                };
                              })
                            }
                          />
                        </td>
                        <td>
                          <label htmlFor={inputId} className="px-4 py-2 block">
                            {l.beverage.name}
                          </label>
                        </td>
                        <td className="px-4 py-2 text-center">{l.quantity}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="h-4" />
            </div>
            <div className="h-4" />
            <div className="flex justify-center">
              <button
                onClick={() =>
                  markOrderCompleteMutation.mutate({
                    orderId: selectedOrder.id,
                  })
                }
                disabled={markOrderCompleteMutation.isPending}
                className={classNames(
                  "px-4 py-2 text-xl text-white bg-green-suit rounded-full",
                  markOrderCompleteMutation.isPending ||
                    selectedOrder.status === "COMPLETED"
                    ? "opacity-50"
                    : "",
                )}
              >
                {selectedOrder.status === "PENDING"
                  ? "Gennemfør"
                  : "Gennemført"}
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex justify-center items-center text-xl text-center text-green-suit p-[35%]">
            Vælg en bestilling for at se flere detaljer
          </div>
        )}
      </div>
    </div>
  );
};

export default trpc.withTRPC(DrikkevarerAdminPage);
