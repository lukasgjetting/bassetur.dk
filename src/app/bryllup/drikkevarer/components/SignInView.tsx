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
  const timeoutIdRef = React.useRef<NodeJS.Timeout | null>(null);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);

  const usersQuery = trpc.getUsers.useQuery();
  const submitSecurityAnswerMutation =
    trpc.submitUserSecurityQuestion.useMutation({
      onSuccess: (result, { userName: userName }) => {
        if (timeoutIdRef.current != null) {
          clearTimeout(timeoutIdRef.current);
        }

        timeoutIdRef.current = setTimeout(() => {
          if (result) {
            // Wait for animation
            onSignIn(userName);
          } else {
            submitSecurityAnswerMutation.reset();
          }
        }, 1500);
      },
    });

  const selectedUser = usersQuery.data?.find(
    (user) => user.name === selectedUserName,
  );

  return (
    <div>
      <div className="px-4 pt-16 pb-6 bg-green-suit">
        <h2 className="text-sm text-green-dust opacity-60">
          Velkommen til vores 5-stjernede web-app
        </h2>
        <div className="h-3" />
        <h1 className="text-3xl font-medium text-green-dust">Hvem er du?</h1>
      </div>
      <div className="flex flex-col gap-2 px-4 pt-4">
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
            <button onClick={() => setIsSecurityModalOpen(false)}>luk</button>
          </div>
          <div className="h-4" />
          {selectedUserName != null && selectedUser != null ? (
            <>
              <p>Bare lige for at være helt sikker... 🤔</p>
              <div className="h-4" />
              <div className="border border-green-dust text-green-suit rounded-lg p-4 text-center">
                {selectedUser?.securityQuestion}
              </div>
              <div className="h-4" />
              <div className="flex flex-col gap-2">
                {selectedUser?.securityQuestionAnswerOptions.map((option) => {
                  const isPreviousSubmission =
                    submitSecurityAnswerMutation.variables
                      ?.securityQuestionAnswer === option;
                  const submissionResult = submitSecurityAnswerMutation.data;

                  let resultLabel: string = "";

                  if (isPreviousSubmission && submissionResult != null) {
                    resultLabel = submissionResult
                      ? "Rigtigt!"
                      : submitSecurityAnswerMutation.variables
                          .securityQuestionAnswer === "Challenger"
                      ? "you wish"
                      : "Forkert!";
                  }

                  return (
                    <button
                      key={option}
                      onClick={() => {
                        submitSecurityAnswerMutation.mutate({
                          userName: selectedUserName,
                          securityQuestionAnswer: option,
                        });
                      }}
                      className={classNames(
                        "py-3 transition-colors duration-500 relative border border-purple-200 rounded-lg",
                        isPreviousSubmission &&
                          submissionResult === true &&
                          "bg-green-200 text-green-900",
                        isPreviousSubmission &&
                          submissionResult === false &&
                          "bg-red-200 text-red-900",
                        !isPreviousSubmission &&
                          "bg-purple-lavender text-bassebrun",
                      )}
                    >
                      <span
                        className={classNames(
                          "transition duration-500",
                          resultLabel === ""
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-2",
                        )}
                      >
                        {option}
                      </span>
                      <div
                        className={classNames(
                          "absolute inset-0 flex justify-center items-center transition duration-500",
                          resultLabel === ""
                            ? "opacity-0 -translate-y-2"
                            : "opacity-100 translate-y-0",
                        )}
                      >
                        {resultLabel}
                      </div>
                    </button>
                  );
                })}
              </div>
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
