"use client";

import { trpc } from "@/lib/trpc";
import { fonts } from "@/utils/fonts";
import { Transition } from "@headlessui/react";
import classNames from "classnames";
import React, { useState } from "react";

type SignInViewProps = {
  onSignIn: (userName: string) => void;
};

const SignInView: React.FC<SignInViewProps> = ({ onSignIn }) => {
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);

  const usersQuery = trpc.getUsers.useQuery();

  const selectedUser = usersQuery.data?.find(
    (user) => user.name === selectedUserName,
  );

  return (
    <div>
      <div className="px-4 pt-16 pb-6 bg-green-suit">
        <h2 className="text-sm text-white opacity-70">
          Velkommen til vores bryllups-web-app
        </h2>
        <div className="h-3" />
        <h1 className="text-3xl font-medium text-white">Hvem er du?</h1>
      </div>
      <div className="flex flex-col gap-2 px-4 pt-4 bg-cream">
        {usersQuery.data?.map((user) => (
          <button
            key={user.name}
            className="p-3 border border-purple-200 rounded-lg text-left text-bassebrun bg-purple-lavender"
            onClick={() => {
              setSelectedUserName(user.name);
              setIsSecurityModalOpen(true);
            }}
          >
            {user.name}
          </button>
        ))}
        <div className="h-4" />
      </div>
      <div
        className={classNames(
          "fixed inset-0 bg-black/20 transition duration-500",
          isSecurityModalOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsSecurityModalOpen(false)}
      />
      <Transition
        show={isSecurityModalOpen}
        enter="transition duration-500"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transition duration-500"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-4"
        as="div"
        className="fixed left-4 right-4 bottom-4 flex flex-col items-stretch justify-center"
      >
        <div className="p-6 rounded-lg bg-white text-green-suit relative">
          <div className="flex justify-between items-center">
            <span className="text-xl">Hej {selectedUser?.name}!</span>
            <button
              className="text-lg p-4 -m-4"
              onClick={() => setIsSecurityModalOpen(false)}
            >
              x
            </button>
          </div>
          <div className="h-4" />
          {selectedUserName != null && selectedUser != null ? (
            <>
              <div className="text-green-suit rounded-lg p-4 text-center">
                <p>
                  Du sidder ved <strong>bord {selectedUser.tableNumber}</strong>
                </p>
              </div>
              <div className="h-4" />
              <button
                onClick={() => onSignIn(selectedUser.name)}
                className={classNames(
                  "py-3 transition-colors duration-500 relative border bg-purple-200 rounded-lg w-full",
                )}
              >
                Okidoki
              </button>
            </>
          ) : (
            "Mystisk! Prøv at genindlæse siden..."
          )}
        </div>
      </Transition>
    </div>
  );
};

export default SignInView;
