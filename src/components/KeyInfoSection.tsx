import { fuzzyBubbles } from "@/utils/fonts";
import getCurrentStay from "@/utils/getCurrentStay";
import { Trip } from "@/utils/types";
import classNames from "classnames";
import { DateTime } from "luxon";
import Image from "next/image";

type KeyInfoSectionProps = {
    trip: Trip;
};

const KeyInfoSection: React.FC<KeyInfoSectionProps> = ({ trip }) => {
    const currentStay =  getCurrentStay(trip.stays);

    
    const daysLeft = Math.floor(DateTime.fromISO(trip.endDate).diffNow('days').days);
    const numberOfStays = currentStay == null ?
        trip.stays.length :
        trip.stays.indexOf(currentStay) + 1;
    const currentLocation = currentStay?.location ?? 'Hjemme';

    const stats = [
        {
            id: 'daysLeft',
            icon: '/icons/calendar.png',
            label: `${daysLeft} dage tilbage`
        },
        {
            id: 'stays',
            icon: '/icons/flag.png',
            label: `${numberOfStays} ${numberOfStays === 1 ? 'sted' : 'steder'} besøgt`
        },
        {
            id: 'currentLocation',
            icon: '/icons/pin.png',
            label: `Nuværende lokation: ${currentLocation}`
        },
    ]

    return (
        <div className="bg-[#CBD29E] p-8 flex items-center justify-around">
            {stats.map((stat) => (
                <div key={stat.id} className="flex items-center gap-2">
                    <Image
                        src={stat.icon}
                        alt=""
                        height={32}
                        width={32}
                        className="block w-6 h-6"
                    />
                    <div
                        className={classNames(
                            'text-xl leading-none text-[#2B4B2D] font-bold pt-1.5',
                            fuzzyBubbles.className
                        )}
                    >
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KeyInfoSection;