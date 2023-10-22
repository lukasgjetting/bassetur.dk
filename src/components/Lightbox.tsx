import classNames from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";

type LightboxProps = {
  images: string[] | null;
  shownImage: string | null;
  imageElement: HTMLImageElement | null;
};

const Lightbox: React.FC<LightboxProps> = ({
  images,
  shownImage,
  imageElement,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [originalBoundingBox, setOriginalBoundingBox] = useState<DOMRect>();

  useEffect(() => {
    if (shownImage == null) {
      return;
    }

    if (imageElement != null) {
      setOriginalBoundingBox(imageElement.getBoundingClientRect());
      console.log("bb", imageElement.getBoundingClientRect());
    }

    setTimeout(() => {
      setIsOpen(true);
    }, 25);
  }, [shownImage, imageElement]);

  return (
    <div
      className={classNames(
        "fixed z-50",
        isOpen
          ? "transition-all duration-700 h-screen w-screen bg-black/25"
          : "pointer-events-none",
      )}
      style={
        isOpen
          ? { inset: 0 }
          : {
              top: originalBoundingBox?.top ?? window.innerHeight / 2,
              left: originalBoundingBox?.left ?? window.innerWidth / 2,
              width: originalBoundingBox?.width ?? 0,
              height: originalBoundingBox?.height ?? 0,
            }
      }
    >
      {shownImage != null && (
        <Image src={shownImage} alt="" fill className="object-contain" />
      )}
    </div>
  );
};

export default Lightbox;
