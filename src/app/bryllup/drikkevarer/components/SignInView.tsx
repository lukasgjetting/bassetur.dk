"use client";

import { trpc } from "@/lib/trpc";
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
      <h1>Velkommen!</h1>
      <h2>Du kan vælge dit navn herunder</h2>
      <div className="flex flex-col gap-4">
        {usersQuery.data?.map((user) => (
          <button
            key={user.name}
            className="p-2 bg-slate-50"
            onClick={() => {
              setSelectedUserName(user.name);
              setIsSecurityModalOpen(true);
            }}
          >
            {user.name}
          </button>
        ))}
      </div>
      <Transition
        show={isSecurityModalOpen}
        enter="transition duration-500"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transition duration-500"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-4"
        as="div"
        className="fixed inset-0 p-4 flex flex-col items-stretch justify-center"
      >
        <div className="p-4 bg-yellow-500 relative">
          <button
            className="absolute right-1 top-1"
            onClick={() => setIsSecurityModalOpen(false)}
          >
            luk
          </button>
          {selectedUserName != null && selectedUser != null ? (
            <>
              Hej {selectedUser?.name}!
              <p>Bare lige for at være helt sikker... 🤔</p>
              {selectedUser?.securityQuestion}
              <div className="flex flex-col">
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
                        "py-4 bg-slate-50 transition-colors duration-500 relative",
                        isPreviousSubmission &&
                          submissionResult === true &&
                          "bg-green-500",
                        isPreviousSubmission &&
                          submissionResult === false &&
                          "bg-red-500",
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
