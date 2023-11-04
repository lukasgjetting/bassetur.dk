"use client";

import { Trip } from "@/utils/types";
import React, { ReactNode } from "react";
import SectionHeading from "../SectionHeading";
import { DateTime, Settings } from "luxon";
import classNames from "classnames";
import { fuzzyBubbles } from "@/utils/fonts";
import Image from "next/image";
import getPetTypeIconUrl from "@/utils/getPetTypeIconUrl";
import getPetGenderIconUrl from "@/utils/getPetGenderIconUrl";
import getStayDateKey from "@/utils/getStayDateKey";
import getCdnImageUrl from "@/utils/getCdnImageUrl";
import getStayKey from "@/utils/getStayKey";
import useLightbox from "../../utils/useLightbox";
import StayContentList from "../StayContentList";

Settings.defaultLocale = "da";

type StayDetailsSectionProps = {
  trip: Trip;
};

const StayDetailsSection: React.FC<StayDetailsSectionProps> = ({ trip }) => {
  const lightbox = useLightbox();

  return (
    <>
      {trip.stays.map((stay, index) => {
        const startDate =
          index === 0
            ? DateTime.fromISO(trip.startDate)
            : DateTime.fromISO(trip.stays[index - 1].endDate);

        const endDate = DateTime.fromISO(stay.endDate);
        const days = startDate
          .until(endDate.plus({ days: 1 }))
          .splitBy({ day: 1 })
          .map((i) => i.start!);

        const hasContent = Object.keys(stay.dates ?? {}).length > 0;

        return (
          <div key={stay.id} id={getStayKey(stay)} className="bg-white">
            {!hasContent &&
              days.map((d) => (
                <div
                  key={getStayDateKey(stay, d)}
                  id={getStayDateKey(stay, d)}
                />
              ))}
            <div className="h-8" style={{ backgroundColor: stay.color }} />
            <div className="p-8 max-w-screen-lg mx-auto">
              <div className="flex gap-2">
                <div className="flex-1">
                  <SectionHeading color={stay.color}>
                    {stay.location || "Ukendt"}
                  </SectionHeading>
                  <div>
                    {startDate.toLocaleString({
                      day: "numeric",
                      month: "short",
                    })}
                    {" - "}
                    {endDate.toLocaleString({ day: "numeric", month: "short" })}
                  </div>
                  <div className="h-8" />
                  {stay.pets.length > 0 && (
                    <>
                      <h3
                        className={classNames(
                          "text-3xl text-[#1F2F20]",
                          fuzzyBubbles.className,
                        )}
                      >
                        Kæledyr
                      </h3>
                      <div className="h-4" />
                      <div className="flex flex-wrap">
                        {stay.pets.map((pet) => (
                          <div
                            key={pet.name}
                            className="flex items-start gap-2 min-w-fit w-1/2 pb-8"
                          >
                            <div className="relative">
                              <Image
                                src={getCdnImageUrl(pet.imageSourceUrl)}
                                width={128}
                                height={128}
                                alt=""
                                className="w-16 h-16 rounded-full border object-cover"
                              />
                              <Image
                                src={getPetGenderIconUrl(pet.gender)}
                                width={24}
                                height={24}
                                alt=""
                                className="absolute -right-0 -bottom-0 w-4 h-4"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <Image
                                  src={getPetTypeIconUrl(pet.type)}
                                  width={24}
                                  height={24}
                                  alt=""
                                />
                                <div
                                  className={classNames(
                                    "text-lg leading-none",
                                    fuzzyBubbles.className,
                                  )}
                                >
                                  {pet.name}
                                </div>
                              </div>
                              <div className="font-light">
                                Race: {pet.race}
                                <br />
                                {pet.age}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {stay.funFacts.length > 0 && (
                    <>
                      <h3
                        className={classNames(
                          "text-3xl text-[#1F2F20]",
                          fuzzyBubbles.className,
                        )}
                      >
                        Info
                      </h3>
                      <div className="h-4" />
                      <ul className="list-inside list-disc ml-2">
                        {stay.funFacts.map((fact) => (
                          <li key={fact} className="pb-2">
                            {fact}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                <div className="w-2/5">
                  <Image
                    src={
                      stay.imageSourceUrl == null
                        ? getCdnImageUrl("default-map.jpg")
                        : getCdnImageUrl(stay.imageSourceUrl)
                    }
                    width={480}
                    height={640}
                    alt=""
                  />
                </div>
              </div>
              <div className="h-8" />
              {hasContent && (
                <>
                  <h3
                    className={classNames(
                      "text-3xl text-[#1F2F20]",
                      fuzzyBubbles.className,
                    )}
                  >
                    Tidslinje
                  </h3>
                  <div className="flex flex-col">
                    {days.map((d, dayIndex) => {
                      const key = getStayDateKey(stay, d);
                      const dateInfo = stay.dates[d.toISODate()!];
                      const content = dateInfo?.content ?? [];
                      const title = dateInfo?.title ?? "";

                      if (content.length === 0) {
                        return <div key={key} id={key} />;
                      }

                      return (
                        <div key={key} id={key} className="flex pt-4">
                          <div
                            className={classNames(
                              "text-right w-28",
                              fuzzyBubbles.className,
                            )}
                          >
                            {d.toLocaleString({
                              day: "numeric",
                              month: "long",
                            })}
                          </div>
                          <div className="relative pt-1 px-4 flex flex-col items-center">
                            <div
                              className="w-4 h-4 rounded-full bg-white border-4"
                              style={{ borderColor: stay.color }}
                            />
                            <div
                              className="flex-1 w-1"
                              style={{ backgroundColor: stay.color }}
                            />
                            <div
                              className="w-1 h-6 absolute top-full"
                              style={{ backgroundColor: stay.color }}
                            />
                          </div>
                          <StayContentList
                            title={title}
                            content={content}
                            openImage={lightbox.openImage}
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <div className="h-16" />
          </div>
        );
      })}
      {lightbox.render()}
    </>
  );
};

export default StayDetailsSection;
