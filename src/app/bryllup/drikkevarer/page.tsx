"use client";
import { trpc } from "@/lib/trpc";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import SignInView from "./components/SignInView";

function Drikkevarer() {
  const [userId, setUserId] = useState(() =>
    typeof localStorage === "undefined" ? null : localStorage.getItem("userId"),
  );
  const searchParams = useSearchParams();
  const query = trpc.beverage.getBeverages.useQuery();

  if (userId == null) {
    return (
      <SignInView
        onSignIn={(userId) => {
          localStorage.setItem("userId", userId);
          setUserId(userId);
        }}
      />
    );
  }

  return (
    <div className="h-screen flex justify-center items-center text-center bg-purple-500 text-purple-950">
      Kommer snart
      {JSON.stringify(query.data, null, 2)}
      {JSON.stringify(searchParams.get("test"), null, 2)}
      <button
        onClick={() => {
          localStorage.removeItem("userId");
          setUserId(null);
        }}
      >
        log ud
      </button>
    </div>
  );
}

export default trpc.withTRPC(Drikkevarer);
