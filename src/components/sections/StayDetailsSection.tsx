import { Stay } from "@/utils/types";
import React, { ReactNode } from "react";
import SectionHeading from "../SectionHeading";
import { DateTime } from "luxon";
import classNames from "classnames";
import { fuzzyBubbles } from "@/utils/fonts";
import Image from "next/image";
import getPetTypeIconUrl from "@/utils/getPetTypeIconUrl";
import getPetGenderIconUrl from "@/utils/getPetGenderIconUrl";
import getStayDateKey from "@/utils/getStayDateKey";
import getStayKey from "@/utils/getStayKey";

type StayDetailsSectionProps = {
    startDate: DateTime;
    stay: Stay;
}

const StayDetailsSection: React.FC<StayDetailsSectionProps> = ({
    startDate,
    stay,
}) => {
    const endDate = DateTime.fromISO(stay.endDate);
    const days = startDate.until(endDate.plus({ days: 1 })).splitBy({ day: 1 }).map((i) => i.start!);
    console.log(days.map((d) => d.toISODate()!))
    const hasContent = Object.keys(stay.contentByDate).length > 0;

    return (
        <div className="bg-white" id={getStayKey(stay)}>
            {!hasContent && days.map((d) => (
                <div key={getStayDateKey(stay, d)} id={getStayDateKey(stay, d)} />
            ))}
            <div className="h-8" style={{ backgroundColor: stay.color }} />
            <div className="p-8 max-w-screen-lg mx-auto">
                <div className="flex gap-2">
                    <div className="flex-1">
                        <SectionHeading color={stay.color}>{stay.location}</SectionHeading>
                        <div>
                            {startDate.toLocaleString({ day: 'numeric', month: 'short' })}
                            {' - '}
                            {endDate.toLocaleString({ day: 'numeric', month: 'short' })}
                        </div>
                        <div className="h-8" />
                        {stay.pets.length > 0 && (
                            <>
                                <h3 className={classNames("text-3xl text-[#1F2F20]", fuzzyBubbles.className)}>Kæledyr</h3>
                                <div className="h-4" />
                                <div className="flex flex-wrap">
                                    {stay.pets.map((pet) => (
                                        <div key={pet.name} className="flex items-start gap-2 min-w-fit w-1/2 pb-8">
                                            <div className="relative">
                                                <Image
                                                    src={pet.imageSourceUrl}
                                                    width={128}
                                                    height={128}
                                                    alt=""
                                                    className="w-16 h-16 rounded-full border object-contain"
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
                                                    <div className={classNames("text-lg leading-none", fuzzyBubbles.className)}>
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
                                <h3 className={classNames("text-3xl text-[#1F2F20]", fuzzyBubbles.className)}>Info</h3>
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
                            src={stay.imageSourceUrl}
                            width={480}
                            height={640}
                            alt=""
                        />
                    </div>
                </div>
                <div className="h-8" />
                {hasContent && (
                    <>
                        <h3 className={classNames("text-3xl text-[#1F2F20]", fuzzyBubbles.className)}>Tidslinje</h3>
                        <div className="flex flex-col">
                            {days.map((d, dayIndex) => {
                                const key = getStayDateKey(stay, d);
                                const content = stay.contentByDate[d.toISODate()!] ?? [];

                                if (content.length === 0) {
                                    return (
                                        <div key={key} id={key} />
                                    );
                                }

                                return (
                                    <div
                                        key={key}
                                        id={key}
                                        className="flex pt-4"
                                    >
                                        <div
                                            className={classNames(
                                                'text-right w-28',
                                                fuzzyBubbles.className
                                            )}
                                        >
                                            {d.toLocaleString({ day: 'numeric', month: 'long' })}
                                        </div>
                                        <div className="relative pt-1 px-4 flex flex-col items-center">
                                            <div
                                                className="w-4 h-4 rounded-full bg-white border-4"
                                                style={{ borderColor: stay.color }}
                                            />
                                            <div className="flex-1 w-1" style={{ backgroundColor: stay.color }} />
                                            <div className="w-1 h-6 absolute top-full" style={{ backgroundColor: stay.color }} />
                                        </div>
                                        <div className="flex-1 flex flex-col pt-8">
                                            <div className="flex flex-wrap gap-4">
                                                {content.map((c, index) => {
                                                    const contentType = c.type;
                                                    
                                                    let element: ReactNode = null;

                                                    switch (contentType) {
                                                        case 'image':
                                                            element = (
                                                                // eslint-disable-next-line @next/next/no-img-element
                                                                <img
                                                                    src={c.value}
                                                                    alt=""
                                                                    loading="lazy"
                                                                    className="h-48 w-auto object-cover"
                                                                />
                                                            );
                                                            break;

                                                        case 'video':
                                                            element = (
                                                                <div className="w-full">
                                                                <video
                                                                    src={c.value}
                                                                    controls
                                                                    className="h-96 w-auto object-cover"
                                                                />
                                                                </div>
                                                            );
                                                            break;

                                                        case 'text':
                                                            element = (
                                                                <div className="w-full">
                                                                    {c.value}
                                                                </div>
                                                            )
                                                            break;

                                                        default:
                                                            contentType satisfies never;
                                                            break;
                                                    }

                                                    return (
                                                        <React.Fragment key={index}>
                                                            {element}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StayDetailsSection;
