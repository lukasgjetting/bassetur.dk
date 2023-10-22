import KeyInfoSection from "@/components/sections/KeyInfoSection";
import ScrollToEnterSection from "@/components/sections/ScrollToEnterSection";
import StayDetailsSection from "@/components/sections/StayDetailsSection";
import SummarySection from "@/components/sections/SummarySection";
import { CaliforniaData } from "@/data/trips/california-data";
import { DateTime } from "luxon";

export default function California() {
  return (
    <main>
      {/*<ScrollToEnterSection />*/}
      <KeyInfoSection trip={CaliforniaData} />
      <SummarySection trip={CaliforniaData} />
      <StayDetailsSection trip={CaliforniaData} />
    </main>
  );
}
