"use client";

import { fuzzyBubbles } from "@/utils/fonts";
import classNames from "classnames";
import Image from "next/image";
import { useEffect, useRef } from "react";

const ScrollToEnterSection = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const { top = 0, height = 0 } =
        wrapperRef.current?.getBoundingClientRect() ?? {};

      const currentScroll = Math.max(0, -top);
      const maxScroll = height - window.innerHeight;
      const scrollPercent = Math.min(1, currentScroll / maxScroll);

      const offsetX =
        scrollPercent *
        (planeRef.current!.parentElement!.clientWidth -
          planeRef.current!.clientWidth);
      const offsetY =
        Math.sin(-scrollPercent * Math.PI) *
        (planeRef.current!.parentElement!.clientHeight * 0.75 -
          planeRef.current!.clientHeight * 0.35);

      planeRef.current!.style.transform = `
                translateX(${offsetX}px)
                translateY(${offsetY}px)
                rotate(${scrollPercent * 360 * 2.2 - 45}deg)
            `;

      document.body.style.setProperty(
        "--intro-scroll",
        `${scrollPercent * 10 + 0.5}px`,
      );

      if (scrollPercent >= 1) {
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section ref={wrapperRef} className="h-[2000vh]">
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
        <div className="h-screen w-[40vw] bg-white text-center text-[#2B4B2D] flex flex-col justify-center">
          <div className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-normal lg:leading-normal xl:leading-normal">
            Store Basse
            <br />
            &
            <br />
            Lille Basse
          </div>
          <div className="h-8" />
          <div className="flex justify-center items-center gap-2">
            på tur til
            <Image
              src="/trips/california.png"
              alt="California"
              width={686}
              height={194}
              className="w-32"
            />
          </div>
          <div className="h-8 xl:h-16" />
          <div className="w-4/5 mx-auto">
            <div className="relative">
              <svg viewBox="0,0 10,3" className="mx-[5%] block">
                <path
                  d="M0,3 C3,0 7,0 10,3"
                  fill="none"
                  stroke="#cbd29e"
                  strokeWidth={0.06}
                  style={{
                    strokeDasharray:
                      "0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4",
                    strokeLinecap: "round",
                  }}
                  strokeDasharray="0.4,0.4"
                />
                <path
                  d="M0,3 C3,0 7,0 10,3"
                  fill="none"
                  stroke="#2B4B2D"
                  strokeWidth={0.1}
                  style={{
                    strokeDasharray: "var(--intro-scroll),1000",
                  }}
                  strokeDasharray="0.4,0.4"
                />
              </svg>
              <Image
                ref={planeRef}
                src="/icons/basse-plane.png"
                width={331}
                height={227}
                alt=""
                className="w-16 absolute bottom-0 z-10 origin-center"
              />
            </div>
            <div className="flex justify-between text-4xl">
              <span>🇩🇰</span>
              <span>🇺🇸</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-lg">Rul ned for at starte turen</span>
            <Image
              src="/icons/chevrons-down-thin.svg"
              alt=""
              height={32}
              width={32}
              className="w-6 h-6 animate-bounce"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollToEnterSection;
