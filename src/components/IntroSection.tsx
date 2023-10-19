'use client';

import { fuzzyBubbles } from "@/utils/fonts";
import classNames from "classnames";
import Image from "next/image";
import { useEffect, useRef } from "react";

const IntroSection = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const planeRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const onScroll = () => {
            const { top = 0, height = 0 } = wrapperRef.current?.getBoundingClientRect() ?? {};

            const currentScroll = Math.max(0, -top)
            const maxScroll = height - window.innerHeight;
            const scrollPercent = Math.min(1, currentScroll / maxScroll);

            const offsetX = scrollPercent * (planeRef.current!.parentElement!.clientWidth - planeRef.current!.clientWidth)
            const offsetY = Math.sin(-scrollPercent * Math.PI) * planeRef.current!.parentElement!.clientHeight * 0.4;

            planeRef.current!.style.transform = `
                translateX(${offsetX}px)
                translateY(${offsetY}px)
                rotate(calc(${scrollPercent} * 360deg)
            `;
            document.body.style.setProperty('--intro-scroll', `${(scrollPercent * 10) + 1}px`);

            if (scrollPercent >= 1) {
                window.removeEventListener('scroll', onScroll);
            }
        };

        
        window.addEventListener('scroll', onScroll);
        onScroll();

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [])

    return (
        <section ref={wrapperRef} className='h-[300vh]'>
          <div
            className={classNames(
              'sticky top-0 h-screen',
              fuzzyBubbles.className,
            )}
          >
            <Image 
              src="/basserne.jpg"
              alt=""
              width={3088}
              height={2320}
              className='h-screen object-cover object-left-top'
            />
            <div className='h-screen w-[40vw] bg-white absolute right-0 top-0 text-center'>
              <div className='text-4xl'>
                Store Basse
                <br />
                &
                <br />
                Lille Basse
              </div>
              <div className='flex justify-center items-center gap-2'>
                på tur til
                <Image
                  src="/california.png"
                  alt="California"
                  width={686}
                  height={194}
                  className='w-32'
                />
              </div>
              <div className='w-4/5 mx-auto'>
                <div className='relative'>
                    <svg viewBox='0,0 10,3' className='mx-4 block'>
                        <path
                            d="M0,3 C3,0 7,0 10,3"
                            fill='none'
                            stroke='black'
                            strokeWidth={0.1}
                            style={{
                                strokeDasharray: '0,var(--intro-scroll),0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4'
                            }}
                            strokeDasharray="0.4,0.4"
                        />
                        <path
                            d="M0,3 C3,0 7,0 10,3"
                            fill='none'
                            stroke='red'
                            strokeWidth={0.1}
                            style={{
                                strokeDasharray: 'var(--intro-scroll),1000'
                            }}
                            strokeDasharray="0.4,0.4"
                        />
                    </svg>
                    <Image
                        ref={planeRef}
                        src="/plane.png"
                        width={331}
                        height={227}
                        alt=""
                        className='w-16 absolute bottom-0 z-10 origin-center'
                    />
                </div>
                <div className='flex justify-between text-4xl'>
                  <span>🇩🇰</span>
                  <span>🇺🇸</span>
                </div>
              </div>
            </div>
          </div>
        </section>
    );
};

export default IntroSection;