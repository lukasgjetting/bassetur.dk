"use client";

import classNames from "classnames";
import { useRef, useState } from "react";

const pinLength = 6;

const PinInput = () => {
  const [pin, setPin] = useState<string>("");
  const inputRefs = [...new Array(pinLength)].map(() =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useRef<HTMLInputElement>(null),
  );

  return (
    <div className="flex flex-col">
      <div className="flex justify-center gap-2">
        {[...new Array(pinLength)].map((_, index) => (
          <input
            ref={inputRefs[index]}
            key={index}
            placeholder="x"
            className="text-center text-6xl leading-none w-16 h-24 border rounded-xl text-transparent"
            style={{
              textShadow: "0 0 0 #000",
            }}
            value={pin[index] ?? ""}
            onKeyDown={(e) => {
              const key = e.key;

              if (e.altKey || e.ctrlKey || e.metaKey) {
                return;
              }

              if (key === "ArrowLeft") {
                inputRefs[index - 1]?.current?.focus();
              } else if (key === "ArrowRight") {
                inputRefs[index + 1]?.current?.focus();
              } else if (key === "Backspace") {
                if (pin[index] == null) {
                  setPin(pin.slice(0, -1));
                } else {
                  setPin(`${pin.slice(0, index)}${pin.slice(index + 1)}`);
                }

                inputRefs[index - 1]?.current?.focus();
              } else if (key.length === 1) {
                if (pin.length > index) {
                  setPin(
                    `${pin.slice(0, index)}${key.toUpperCase()}${pin.slice(
                      index + 1,
                    )}`,
                  );
                } else {
                  setPin(`${pin}${key.toUpperCase()}`.slice(0, pinLength));
                }
                inputRefs[index + 1]?.current?.focus();
              }
            }}
          />
        ))}
      </div>
      <div className="h-8" />
      <a
        className={classNames(
          "block text-center self-stretch mx-8 rounded-full text-xl px-2 py-8 transition",
          pin.length === pinLength
            ? "cursor-pointer bg-[#CBD29E] hover:bg-[#cbd48f]"
            : "cursor-not-allowed bg-gray-100",
        )}
        href={
          pin.length === pinLength ? `/trips/${pin.toLowerCase()}` : undefined
        }
      >
        Kom i gang
      </a>
    </div>
  );
};

export default PinInput;
