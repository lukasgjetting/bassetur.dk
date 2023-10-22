import { fuzzyBubbles } from "@/utils/fonts";
import getCurrentStay from "@/utils/getCurrentStay";
import { Trip } from "@/utils/types";
import classNames from "classnames";
import { DateTime } from "luxon";
import Image from "next/image";
import React, { ReactNode } from "react";
import tinycolor from "tinycolor2";
import SectionHeading from "../SectionHeading";

type KeyInfoSectionProps = {
    trip: Trip;
};

const SummarySection: React.FC<KeyInfoSectionProps> = ({ trip }) => {
    const start = DateTime.fromISO(trip.startDate).startOf('week');
    const end = DateTime.fromISO(trip.endDate).endOf('week');
    const weekStartDates = start.startOf('month').until(end.endOf('month')).splitBy({ week: 1 })
        .map((d) => d.start?.startOf('week'))
        .filter((d): d is DateTime => d != null);

    return (
        <div id="trip-summary" className="bg-[#FFF5E5]">
            <div className="p-8 max-w-screen-lg mx-auto relative">
                <SectionHeading color="#AF8B75">Indholdsfortegnelse</SectionHeading>
                <div className="h-8" />
                <div className="flex">
                    <div className="pr-16 sticky top-4 self-start">
                        {trip.stays.map((s) => (
                            <div key={s.id} className="flex items-center gap-4 mb-4">
                                <div className="block w-6 h-6 border-2 border-white rounded-full" style={{ backgroundColor: s.color }} />
                                <div className="text-2xl font-extralight leading-none">
                                    {s.location}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex-1">
                        {weekStartDates.reduce<ReactNode[]>((arr, weekStartDate, index) => {
                            const isLastWeekOfMonth = weekStartDate.plus({ month: 1 }).startOf('month').hasSame(weekStartDate, 'week');

                            const getWeekRow = (isPrev: boolean) => (
                                <div key={`${weekStartDate.toISO()}${isPrev ? '-prev' : ''}`} className="flex">
                                    {weekStartDate.until(weekStartDate.endOf('week')).splitBy({ day: 1 }).map((interval) => {
                                        const d = interval.start;

                                        if (d == null) {
                                            return null;
                                        }

                                        const currentStay = getCurrentStay(trip.stays, d);
                                        const tomorrowStay = getCurrentStay(trip.stays, d.plus({ days: 1 }))

                                        let backgroundColor: string | null;

                                        const isBeforeStart = d.diff(DateTime.fromISO(trip.startDate)).milliseconds < 0;
                                        const isAfterEnd = d.diff(DateTime.fromISO(trip.endDate)).milliseconds > 0;

                                        if(isBeforeStart || isAfterEnd) {
                                            backgroundColor = '#fff6';
                                        } else if (currentStay != null) {
                                            backgroundColor = currentStay!.color
                                        } else {
                                            backgroundColor = null;
                                        }

                                        const textColor = tinycolor(tomorrowStay?.color ?? backgroundColor ?? '#000').darken(50).toHexString();

                                        return (
                                            <div
                                                key={d.toISO()}
                                                className="p-1 flex-1"
                                            >
                                                <div
                                                    className={classNames(
                                                        "relative font-light leading-none h-12 rounded",
                                                        !d.endOf('week').hasSame(d, 'month') !== isPrev && 'opacity-30 pointer-events-none',
                                                        backgroundColor != null && 'bg-white bg-opacity-50',
                                                    )}
                                                >
                                                    <div className="absolute inset-0 flex">
                                                        {[
                                                            ...(!isBeforeStart && !isAfterEnd && currentStay != null ? [backgroundColor] : []),
                                                            ...(tomorrowStay != null && currentStay != tomorrowStay ? [tomorrowStay.color] : []),
                                                        ].map((color, index) => (
                                                            <a
                                                                key={index.toString()}
                                                                href="/"
                                                                className={classNames(
                                                                    "flex-1 hover:scale-105 hover:-translate-y-1 transition-transform rounded py-1 border-t-2 flex flex-col items-stretch justify-between w-full",
                                                                )}
                                                                style={{
                                                                    backgroundColor: color ?? 'white',
                                                                    borderTopColor: tinycolor(color ?? 'white').darken(10).toHexString(),
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                    {(
                                                        d.hasSame(DateTime.fromISO(trip.startDate), 'day') ||
                                                        d.hasSame(DateTime.fromISO(trip.endDate), 'day')
                                                    ) && (
                                                        <div className="absolute top-1 bottom-0 left-1 pointer-events-none">
                                                            <Image
                                                                src="/icons/plane.png"
                                                                alt="Plane"
                                                                width={331}
                                                                height={227}
                                                                className="w-10"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="relative z-10 p-1 flex justify-between pointer-events-none">
                                                        <div>
                                                            {d.hasSame(DateTime.now(), 'day') && (
                                                                <div className="h-4 w-4 rounded-full bg-white shadow" />
                                                            )}
                                                        </div>
                                                        <div style={{ color: textColor }}>{d.toFormat('dd')}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )

                            return [
                                ...arr,
                                ...(index !== 0 && isLastWeekOfMonth ? [(
                                    <React.Fragment key={`${weekStartDate.toISO()}-prev`}>
                                        {getWeekRow(true)}
                                        <div className="h-8" />
                                    </React.Fragment>    
                                )] : []),
                                ...(index === 0 || isLastWeekOfMonth ? [(
                                    <div key={`weekdays-${weekStartDate.toISO()}`} className="flex">
                                        {['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'].map((day) => (
                                            <div key={day} className="text-sm px-1 pb-2 text font-light leading-none flex-1 text-right">
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                )] : []),
                                getWeekRow(false),
                            ];
                        }, [])}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummarySection;