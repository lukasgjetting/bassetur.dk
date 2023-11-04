import getCdnImageUrl from "@/utils/getCdnImageUrl";
import { Stay } from "@/utils/types";
import { UseLightboxValue } from "@/utils/useLightbox";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import classNames from "classnames";
import React, { ReactNode, useState } from "react";

type StayContentListProps = {
  title: string;
  content: Stay["dates"][string]["content"];
  openImage: UseLightboxValue["openImage"];
};

const StayContentList: React.FC<StayContentListProps> = ({
  title,
  content,
  openImage,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [autoAnimateRef] = useAutoAnimate<HTMLDivElement>();

  return (
    <div className="flex-1 flex flex-col">
      <button
        className="font-bold text-left hover:bg-slate-100 py-1.5 px-3 -my-1.5 -mx-3 rounded-full w-fit flex items-center gap-2"
        onClick={() => setIsVisible(!isVisible)}
      >
        {title}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 512 512"
          className={classNames("transition", isVisible && "rotate-180")}
        >
          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
        </svg>
      </button>
      <div ref={autoAnimateRef} className="flex flex-wrap gap-4 pb-12 pt-4">
        {isVisible &&
          content.map((c, index) => {
            const contentType = c.type;

            let element: ReactNode = null;

            switch (contentType) {
              case "image":
                element = (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getCdnImageUrl(c.value)}
                    alt=""
                    loading="lazy"
                    className="h-48 w-auto object-cover cursor-pointer transition hover:-translate-y-1 hover:scale-105 hover:shadow"
                    onClick={(e) => {
                      const startElement = content
                        .slice(0, index)
                        .reverse()
                        .find((c) => c.type !== "image");
                      const cutoffElement = content
                        .slice(index)
                        .find((c) => c.type !== "image");

                      const images = content
                        .slice(
                          startElement != null
                            ? content.indexOf(startElement) + 1
                            : 0,
                          cutoffElement != null
                            ? content.indexOf(cutoffElement)
                            : undefined,
                        )
                        .filter((c) => c.type === "image")
                        .map((c) => getCdnImageUrl(c.value));

                      openImage(
                        getCdnImageUrl(c.value),
                        images,
                        e.target as HTMLImageElement,
                      );
                    }}
                  />
                );
                break;

              case "video":
                element = (
                  <div className="w-full">
                    <video
                      src={getCdnImageUrl(c.value)}
                      controls
                      className="h-96 w-auto object-cover"
                    />
                  </div>
                );
                break;

              case "text":
                element = <div className="w-full">{c.value}</div>;
                break;

              default:
                contentType satisfies never;
                break;
            }

            return <React.Fragment key={index}>{element}</React.Fragment>;
          })}
      </div>
    </div>
  );
};

export default StayContentList;
