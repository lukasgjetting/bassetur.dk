"use client";

import { trpc } from "@/lib/trpc";
import { fonts } from "@/utils/fonts";
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

  const markBeverageSoldOutMutation =
    trpc.beverage.markBeverageSoldOut.useMutation({
      onSuccess: () => {
        ordersQuery.refetch();
      },
    });

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
    <div className="flex h-screen" style={fonts.comfortaa.style}>
      <div className="flex-1 flex flex-col">
        <div className="flex text-center">
          <button
            className={classNames(
              "flex-1 py-6 text-lg font-bold",
              openList === "new"
                ? "bg-green-suit text-white z-20 relative"
                : "bg-green-suit/10",
            )}
            onClick={() => setOpenList("new")}
          >
            AFVENTER
          </button>
          <button
            className={classNames(
              "flex-1 py-6 text-lg font-bold",
              openList === "history"
                ? "bg-green-suit/75 text-white"
                : "bg-green-suit/10",
            )}
            onClick={() => setOpenList("history")}
          >
            HISTORIK
          </button>
        </div>
        <div
          className={classNames(
            "pt-4 flex-1 overflow-y-auto flex flex-col gap-4 pb-8",
            openList === "new" ? "bg-green-suit" : "bg-green-suit/75",
          )}
        >
          {visibleOrders.map((o, index) => {
            const cocktails = o.orderLines.filter(
              (l) => l.beverage.type === "COCKTAIL",
            );
            const soldOutLines = o.orderLines.filter(
              (l) => l.beverage.quantity === 0,
            );

            return (
              <div
                key={o.id}
                className={classNames(
                  "ml-4 pr-4 rounded-l-lg",
                  o.id === selectedOrderId && "shadow-lg",
                )}
              >
                <button
                  className={classNames(
                    "w-full text-left flex justify-between items-center px-4 py-4 rounded-lg  transition duration-300",
                    o.id === selectedOrderId
                      ? "relative translate-x-6 bg-white"
                      : "shadow-lg bg-lime-100",
                  )}
                  onClick={() => setSelectedOrderId(o.id)}
                >
                  <div className="flex flex-col self-start">
                    <div className="text-xl font-semibold">
                      Bord {o.user.tableNumber}
                    </div>
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
                    <div className="text-lg">
                      <span className="font-bold">
                        {o.orderLines.reduce((a, b) => a + b.quantity, 0)}{" "}
                      </span>
                      {o.orderLines.length === 1 &&
                      o.orderLines[0].quantity === 1
                        ? "drikkevare"
                        : "drikkevarer"}
                    </div>
                    <div className="flex flex-col gap-0.5 text-right">
                      {cocktails.map((c) => (
                        <div key={c.id} className="text-sm text-gray-500">
                          {c.beverage.name} x {c.quantity}
                        </div>
                      ))}
                      {soldOutLines.map((l) => (
                        <div key={l.id} className="text-sm text-red-500">
                          Udsolgt: {l.beverage.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex-[2] bg-white">
        {selectedOrder != null ? (
          <div className="p-16">
            <div className="text-center text-4xl">
              Bord {selectedOrder.user.tableNumber}
            </div>
            <div className="h-12" />
            <div
              className={classNames(
                "rounded-lg bg-white border",
                selectedOrder.status === "COMPLETED" && "opacity-50",
              )}
            >
              <table className="w-full">
                <thead className="text-sm align-middle">
                  <th className="px-4 py-2 w-12"></th>
                  <th className="px-4 py-4 text-left">Drikkevare</th>
                  <th className="px-4 py-4 w-12">Stk</th>
                </thead>
                <tbody className="text-lg">
                  {selectedOrder.orderLines.map((l, index) => {
                    const isOdd = index % 2 === 1;
                    const inputId = `checkbox-${selectedOrder.id}-${index}`;
                    return (
                      <tr key={l.id} className={isOdd ? "bg-slate-50" : ""}>
                        <td className="px-4 py-4">
                          <input
                            disabled={
                              selectedOrder.status === "COMPLETED" ||
                              l.beverage.quantity === 0
                            }
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
                          <label
                            htmlFor={inputId}
                            className={classNames(
                              "px-4 py-4 inline-block",
                              l.beverage.quantity === 0
                                ? "line-through text-red-600"
                                : "",
                            )}
                          >
                            {l.beverage.name}
                          </label>
                          {l.beverage.quantity === 0 && (
                            <span className="text-red-600 text-xs italic">
                              UDSOLGT
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-center">{l.quantity}</td>
                        <td className="px-4 w-16">
                          <button
                            className={classNames(
                              "rounded-full border border-red-600 bg-red-100 text-red-800 px-4 py-2",
                              l.beverage.quantity === 0 ? "opacity-50" : "",
                            )}
                            disabled={l.beverage.quantity === 0}
                            onClick={() => {
                              if (
                                confirm(
                                  `Er vi løbet tør for ${l.beverage.name}?`,
                                )
                              ) {
                                markBeverageSoldOutMutation.mutate({
                                  beverageId: l.beverage.id,
                                });
                              }
                            }}
                          >
                            Udsolgt
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="h-4" />
            </div>
            <div className="h-4" />
            <div className="flex justify-center">
              {selectedOrder.status === "PENDING" && (
                <button
                  onClick={() =>
                    markOrderCompleteMutation.mutate({
                      orderId: selectedOrder.id,
                    })
                  }
                  disabled={markOrderCompleteMutation.isPending}
                  className={classNames(
                    "px-4 py-2 text-xl text-white bg-green-suit rounded-full",
                    markOrderCompleteMutation.isPending ? "opacity-50" : "",
                  )}
                >
                  Gennemfør
                </button>
              )}
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
