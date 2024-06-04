"use client";

import { trpc } from "@/lib/trpc";

const IsAdmin = () => {
  const allSelectionsQuery = trpc.iceCream.getAllSelections.useQuery();

  const tables = [
    ...new Set(allSelectionsQuery.data?.map((user) => user.tableNumber) ?? []),
  ].sort();

  return (
    <div className="min-h-screen bg-white">
      <div className="flex px-1 w-full flex-wrap pt-6 pb-6 bg-cream">
        {tables.map((table) => {
          const users =
            allSelectionsQuery.data?.filter(
              (user) => user.tableNumber === table,
            ) ?? [];

          if (users.length === 0) {
            return null;
          }

          return (
            <div key={table} className="w-full mb-24">
              <h2 className="text-4xl text-center font-bold mb-2">
                Bord {table}
              </h2>
              <table className="w-full text-center text-lg">
                <thead>
                  <tr className="bg-green-suit-dark text-white">
                    <th className="">Navn</th>
                    <th className="">Kugle 1</th>
                    <th className="">Kugle 2</th>
                    <th className="">Backup</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.name} className="odd:bg-slate-100">
                      <td className="p-2 font-bold">{user.name}</td>
                      <td className="p-2">{user.iceCreamSelection[0]}</td>
                      <td className="p-2">{user.iceCreamSelection[1]}</td>
                      <td className="p-2">{user.iceCreamSelection[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default trpc.withTRPC(IsAdmin);
