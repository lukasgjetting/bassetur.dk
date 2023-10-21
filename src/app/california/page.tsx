import KeyInfoSection from "@/components/KeyInfoSection";
import ScrollToEnterSection from "@/components/ScrollToEnterSection";
import SummarySection from "@/components/SummarySection";
import { CaliforniaData } from "@/data/trips/california-data";

export default function California() {
    return (
        <main>
            {/*<ScrollToEnterSection />*/}
            <KeyInfoSection trip={CaliforniaData} />
            <SummarySection trip={CaliforniaData} />
        </main>
    );
} 