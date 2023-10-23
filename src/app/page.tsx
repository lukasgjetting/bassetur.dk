import PinInput from "@/components/PinInput";
import { fuzzyBubbles } from "@/utils/fonts";
import classNames from "classnames";
import Image from "next/image";

export default function Home() {
  return (
    <main className="">
      <div
        className={classNames(
          "sticky top-0 h-screen flex",
          fuzzyBubbles.className,
        )}
      >
        <div className="flex-1">
          <Image
            src="/images/basserne.jpg"
            alt=""
            width={3088}
            height={2320}
            className="h-[75vh] sm:h-screen object-cover object-left-top"
          />
        </div>
        <div className="flex lg:hidden text-lg sm:w-48 absolute bottom-4 right-4 left-4 sm:left-auto rounded bg-white/80 p-4">
          Hejsa! Basserne anbefaler at du åbner siden på en tablet (på siden)
          eller en computer.
        </div>
        <div className="hidden lg:flex min-w-[480px] w-[40vw] flex-col justify-between items-center">
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-6xl text-center">Velkommen til bassetur.dk</h1>
            <div className="h-16" />
            <h2 className="text-xl text-center">
              Indtast din tur-kode herunder
            </h2>
            <div className="h-4" />
            <PinInput />
          </div>
        </div>
      </div>
    </main>
  );
}
