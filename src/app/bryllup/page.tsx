import { fuzzyBubbles } from "@/utils/fonts";
import classNames from "classnames";

const isEnabled = false;

const BryllupsApp = () => (
    <div className={classNames(fuzzyBubbles.className, "bg-purple-700 min-h-screen text-white p-4 flex flex-col items-center justify-center pb-[25vh]")}>
        <h1 className="font-bold text-4xl text-center">Bryllup</h1>
        <div className="h-12" />
        <div className="relative">
            <a
                href={isEnabled ? '/bryllup/oversigt' : '#'}
                className={classNames(!isEnabled && "opacity-75", "block bg-white text-purple-800 px-12 py-4 text-lg font-black rounded-full shadow-lg border border-purple-300")}
            >
                Kom indenfor
            </a>
            {!isEnabled && (
            <div className="absolute top-full mt-4">
                <img src="/images/arrow-up.png" className="invert" />
                <div className="absolute text-2xl left-full top-full -translate-y-1/2 ml-4 w-max">Kommer snart!</div>
            </div>
            )}
        </div>
    </div>
);

export default BryllupsApp;