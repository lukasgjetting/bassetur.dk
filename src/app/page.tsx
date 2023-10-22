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
            src="/trips/california/basserne.jpg"
            alt=""
            width={3088}
            height={2320}
            className="h-screen object-cover object-left-top"
          />
        </div>
        <div className="w-[40vw] flex flex-col justify-between items-center">
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
