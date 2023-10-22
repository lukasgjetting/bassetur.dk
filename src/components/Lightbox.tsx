"use client";

import classNames from "classnames";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type LightboxProps = {
  images: string[] | null;
  shownImage: string | null;
  imageElement: HTMLImageElement | null;
  onClose: () => void;
};

const animationDuration = 700;

const Lightbox: React.FC<LightboxProps> = ({
  images,
  shownImage,
  imageElement,
  onClose,
}) => {
  const [currentImage, setCurrentImage] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [originalBoundingBox, setOriginalBoundingBox] = useState<DOMRect>();

  const close = useCallback(() => {
    setIsOpen(false);
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
      setCurrentImage(undefined);
      onClose();
    }, animationDuration);
  }, [onClose]);

  const changeImage = useCallback(
    (nextOrPrev: "next" | "prev") => {
      setCurrentImage((oldImage) => {
        if (images == null || oldImage == null) {
          return oldImage;
        }

        const currentIndex = images.indexOf(oldImage);

        if (currentIndex === -1) {
          return oldImage;
        }

        let newIndex: number;

        if (nextOrPrev === "next") {
          newIndex = currentIndex + 1;
        } else {
          newIndex = currentIndex - 1;
        }

        if (images[newIndex] == null) {
          return oldImage;
        }

        return images[newIndex];
      });
    },
    [images],
  );

  useEffect(() => {
    if (shownImage == null) {
      return;
    }

    if (imageElement != null) {
      setOriginalBoundingBox(imageElement.getBoundingClientRect());
    }

    setCurrentImage(shownImage);

    setTimeout(() => {
      setIsOpen(true);
      setIsAnimating(true);

      setTimeout(() => {
        setIsAnimating(false);
      }, animationDuration);
    }, 25);
  }, [shownImage, imageElement]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const preventScroll = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      return false;
    };

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      } else if (e.key === "ArrowLeft") {
        changeImage("prev");
      } else if (e.key === "ArrowRight") {
        changeImage("next");
      }
    };

    window.addEventListener("keydown", keyHandler);
    document.body.addEventListener("wheel", preventScroll, { passive: false });

    return () => {
      window.removeEventListener("keydown", keyHandler);
      document.body.removeEventListener("wheel", preventScroll);
    };
  }, [isOpen, close, changeImage]);

  return (
    <div
      className={classNames(
        "fixed z-50",
        isOpen || isAnimating
          ? "transition-all h-screen w-screen"
          : "transition-none pointer-events-none",
        isOpen && "bg-black/50",
        isAnimating && !isOpen && "opacity-0",
      )}
      style={{
        transitionDuration: `${animationDuration}ms`,
        ...(isOpen
          ? { top: 0, left: 0, right: 0, bottom: 64 }
          : {
              top: originalBoundingBox?.top ?? window.innerHeight / 2,
              left: originalBoundingBox?.left ?? window.innerWidth / 2,
              width: originalBoundingBox?.width ?? 0,
              height: originalBoundingBox?.height ?? 0,
            }),
      }}
    >
      {currentImage != null && (
        <Image src={currentImage} alt="" fill className="object-contain" />
      )}
      {isOpen && !isAnimating && (
        <>
          <button onClick={close} className="absolute top-12 right-12 p-4">
            <div className="bg-[#FFF5E5] p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#b47a57]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </button>
          <button
            onClick={() => changeImage("next")}
            className={classNames(
              "absolute top-1/2 right-12 p-4",
              currentImage === images?.[images.length - 1] && "opacity-25",
            )}
          >
            <div className="bg-[#FFF5E5] p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="relative -right-0.5 h-8 w-8 text-[#b47a57]"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </div>
          </button>
          <button
            onClick={() => changeImage("prev")}
            className={classNames(
              "absolute top-1/2 left-12 p-4",
              currentImage === images?.[0] && "opacity-25",
            )}
          >
            <div className="bg-[#FFF5E5] p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="relative -left-0.5 h-8 w-8 text-[#b47a57]"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                />
              </svg>
            </div>
          </button>
        </>
      )}
      {isOpen && !isAnimating && images != null && images.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/25 flex justify-center p-4 gap-4">
          {images.map((image) => (
            <button
              key={image}
              className={classNames(
                "border",
                image === currentImage && "ring-8",
              )}
              onClick={() => setCurrentImage(image)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="h-16 w-auto object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Lightbox;
