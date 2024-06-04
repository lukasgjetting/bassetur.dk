import { Fuzzy_Bubbles, Comfortaa, Dancing_Script } from "next/font/google";
import localFont from "next/font/local";

export const fuzzyBubbles = Fuzzy_Bubbles({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const rosabelia = localFont({ src: "../../public/fonts/rosabelia.ttf" });

export const comfortaa = Comfortaa({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

export const dancing = Dancing_Script({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const fonts = { fuzzyBubbles, rosabelia, comfortaa, dancing };
