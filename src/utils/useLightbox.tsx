"use client";

import Lightbox from "@/components/Lightbox";
import { useCallback, useState } from "react";

const useLightbox = () => {
  const [data, setData] = useState<{
    shownImage?: string;
    images: string[];
    imageElement: HTMLImageElement | null;
  }>();

  const onClose = useCallback(() => {
    setData(undefined);
  }, []);

  return {
    openImage: (
      image: string,
      allImages: string[],
      imageElement?: HTMLImageElement,
    ) => {
      setData({
        shownImage: image,
        images: allImages,
        imageElement: imageElement ?? null,
      });
    },
    render: () => (
      <Lightbox
        images={data?.images ?? null}
        shownImage={data?.shownImage ?? null}
        imageElement={data?.imageElement ?? null}
        onClose={onClose}
      />
    ),
  };
};

export default useLightbox;
