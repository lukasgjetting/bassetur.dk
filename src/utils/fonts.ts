import { Fuzzy_Bubbles, Comfortaa } from "next/font/google";
import localFont from "next/font/local";

export const fuzzyBubbles = Fuzzy_Bubbles({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const rosabelia = localFont({ src: "../../public/fonts/rosabelia.ttf" });

export const comfortaa = Comfortaa({
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const fonts = { fuzzyBubbles, rosabelia, comfortaa };
