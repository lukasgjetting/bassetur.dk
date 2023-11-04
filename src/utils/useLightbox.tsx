"use client";

import dynamic from "next/dynamic";
import { ReactNode, useCallback, useState } from "react";

export type UseLightboxValue = {
  openImage: (
    image: string,
    allImages: string[],
    imageElement?: HTMLImageElement,
  ) => void;
  render: () => ReactNode;
};

const Lightbox = dynamic(() => import("@/components/Lightbox"), {
  loading: () => <div />,
  ssr: false,
});

const useLightbox = (): UseLightboxValue => {
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
