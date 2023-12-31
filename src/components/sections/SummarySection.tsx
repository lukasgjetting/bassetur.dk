"use client";

import getCurrentStay from "@/utils/getCurrentStay";
import { Trip } from "@/utils/types";
import classNames from "classnames";
import { DateTime, Settings } from "luxon";
import Image from "next/image";
import React, { ReactNode, useState } from "react";
import tinycolor from "tinycolor2";
import SectionHeading from "../SectionHeading";
import getStayKey from "@/utils/getStayKey";
import getStayDateKey from "@/utils/getStayDateKey";
import { fuzzyBubbles } from "@/utils/fonts";
import getStayTransportIconUrl from "@/utils/getStayTransportIconUrl";

type KeyInfoSectionProps = {
  trip: Trip;
};

Settings.defaultLocale = "da";

const SummarySection: React.FC<KeyInfoSectionProps> = ({ trip }) => {
  const start = DateTime.fromISO(trip.startDate).startOf("week");
  const end = DateTime.fromISO(trip.endDate).endOf("week");
  const weekStartDates = start
    .startOf("month")
    .until(end.endOf("month"))
    .splitBy({ week: 1 })
    .map((d) => d.start?.startOf("week"))
    .filter((d): d is DateTime => d != null);

  const [hoveredStay, setHoveredStay] = useState<string>();

  return (
    <div id="trip-summary" className="bg-[#FFF5E5]">
      <div className="p-8 max-w-screen-lg mx-auto relative">
        <div className="h-8" />
        <SectionHeading color="#AF8B75">Indholdsfortegnelse</SectionHeading>
        <div className="h-12" />
        <div className="flex">
          <div className="pr-16 sticky top-4 self-start">
            {trip.stays.map((s) => (
              <div key={s.id} className="flex items-center gap-4 mb-4">
                <div
                  className="block w-6 h-6 border-2 border-white rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <a
                  className={classNames(
                    "text-2xl font-extralight leading-none p-2 -m-2 bg-[#AF8B75] bg-opacity-0 hover:bg-opacity-10 rounded-lg transition",
                    s.location === "" && "italic text-[#0009]",
                  )}
                  href={`#${getStayKey(s)}`}
                  onMouseOver={() => setHoveredStay(s.id)}
                  onMouseOut={() => setHoveredStay(undefined)}
                >
                  {s.location || "Ukendt"}
                </a>
              </div>
            ))}
          </div>
          <div className="flex-1 relative">
            {weekStartDates.reduce<ReactNode[]>((arr, weekStartDate, index) => {
              const isLastWeekOfMonth = weekStartDate
                .plus({ month: 1 })
                .startOf("month")
                .hasSame(weekStartDate, "week");

              const getWeekRow = (isPrev: boolean) => (
                <div
                  key={`${weekStartDate.toISO()}${isPrev ? "-prev" : ""}`}
                  className="flex"
                >
                  {weekStartDate
                    .until(weekStartDate.endOf("week"))
                    .splitBy({ day: 1 })
                    .map((interval) => {
                      const d = interval.start;

                      if (d == null) {
                        return null;
                      }

                      const currentStay = getCurrentStay(trip.stays, d);
                      const tomorrowStay = getCurrentStay(
                        trip.stays,
                        d.plus({ days: 1 }),
                      );

                      const isBeforeStart =
                        d.diff(DateTime.fromISO(trip.startDate)).milliseconds <
                        0;
                      const isAfterEnd =
                        d.diff(DateTime.fromISO(trip.endDate)).milliseconds > 0;

                      const textColor = tinycolor(
                        tomorrowStay?.color ?? currentStay?.color ?? "#000",
                      )
                        .darken(50)
                        .toHexString();

                      let transportIcon: string | null = null;

                      if (
                        d.hasSame(DateTime.fromISO(trip.startDate), "day") ||
                        d.hasSame(DateTime.fromISO(trip.endDate), "day")
                      ) {
                        transportIcon = getStayTransportIconUrl("plane");
                      } else if (
                        tomorrowStay != null &&
                        tomorrowStay !== currentStay
                      ) {
                        transportIcon = getStayTransportIconUrl(
                          tomorrowStay.transport,
                        );
                      }

                      return (
                        <div key={d.toISO()} className="p-1 flex-1">
                          <div
                            className={classNames(
                              "relative font-light leading-none h-12 rounded",
                              !d.endOf("week").hasSame(d, "month") !== isPrev &&
                                "opacity-30 pointer-events-none",
                              (isBeforeStart || isAfterEnd) &&
                                "bg-white bg-opacity-50",
                            )}
                          >
                            <div className="absolute inset-0 flex">
                              {[
                                ...(!isBeforeStart &&
                                !isAfterEnd &&
                                currentStay != null
                                  ? [currentStay]
                                  : []),
                                ...(tomorrowStay != null &&
                                currentStay != tomorrowStay
                                  ? [tomorrowStay]
                                  : []),
                              ].map((s, index) => (
                                <a
                                  key={index.toString()}
                                  href={`#${getStayDateKey(s, d)}`}
                                  className={classNames(
                                    "flex-1 hover:scale-105 hover:-translate-y-1 hover:shadow transition rounded py-1 border-t-2 flex flex-col items-stretch justify-between w-full",
                                    hoveredStay != null &&
                                      (s.id === hoveredStay
                                        ? "shadow-lg scale-105 -translate-y-1"
                                        : "opacity-25"),
                                  )}
                                  style={{
                                    backgroundColor: s.color ?? "white",
                                    borderTopColor: tinycolor(
                                      s.color ?? "white",
                                    )
                                      .darken(10)
                                      .toHexString(),
                                  }}
                                />
                              ))}
                            </div>
                            {transportIcon != null && (
                              <div className="absolute top-1 bottom-0 left-1 pointer-events-none">
                                <Image
                                  src={transportIcon}
                                  alt=""
                                  width={331}
                                  height={227}
                                  className="w-10"
                                />
                              </div>
                            )}
                            <div
                              className="relative z-10 p-1 text-right pointer-events-none"
                              style={{ color: textColor }}
                            >
                              {d.toFormat("dd")}
                            </div>
                            {d.hasSame(DateTime.now(), "day") && (
                              <div className="relative z-10 p-1 flex justify-end pointer-events-none">
                                <div className="text-xs bg-white rounded-full px-2">
                                  I dag
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              );

              return [
                ...arr,
                ...(index !== 0 && isLastWeekOfMonth
                  ? [
                      <React.Fragment key={`${weekStartDate.toISO()}-prev`}>
                        {getWeekRow(true)}
                        <div className="h-8" />
                      </React.Fragment>,
                    ]
                  : []),
                ...(index === 0 || isLastWeekOfMonth
                  ? [
                      <div
                        key={`weekdays-${weekStartDate.toISO()}`}
                        className="flex"
                      >
                        {[
                          "Mandag",
                          "Tirsdag",
                          "Onsdag",
                          "Torsdag",
                          "Fredag",
                          "Lørdag",
                          "Søndag",
                        ].map((day) => (
                          <div
                            key={day}
                            className="text-sm px-1 pb-2 text font-light leading-none flex-1 text-right"
                          >
                            {day}
                          </div>
                        ))}
                      </div>,
                    ]
                  : []),
                ...(isLastWeekOfMonth
                  ? [
                      <div
                        key={`month-${weekStartDate.toISODate()}`}
                        className="absolute -left-12 w-20 text-right"
                      >
                        <div
                          className={classNames(
                            "relative -rotate-90 top-10 font-extralight tracking-widest",
                          )}
                        >
                          {weekStartDate.plus({ weeks: 1 }).toFormat("MMMM")}
                        </div>
                      </div>,
                    ]
                  : []),
                getWeekRow(false),
              ];
            }, [])}
          </div>
        </div>
        <div className="h-8" />
      </div>
    </div>
  );
};

export default SummarySection;
