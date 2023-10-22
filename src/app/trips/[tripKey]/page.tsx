import KeyInfoSection from "@/components/sections/KeyInfoSection";
import ScrollToEnterSection from "@/components/sections/ScrollToEnterSection";
import StayDetailsSection from "@/components/sections/StayDetailsSection";
import SummarySection from "@/components/sections/SummarySection";
import { Trip } from "@/utils/types";
import { kv } from "@vercel/kv";
import { Settings } from "luxon";

Settings.defaultLocale = "da";

export default async function TripDetails({
  params,
}: {
  params: { tripKey: string };
}) {
  try {
    const tripData = (await kv.get(`trips-${params.tripKey}`)) as Trip | null;

    if (tripData == null || typeof tripData !== "object") {
      throw new Error("Ugyldig turkode");
    }

    return (
      <main>
        <ScrollToEnterSection />
        <KeyInfoSection trip={tripData} />
        <SummarySection trip={tripData} />
        <StayDetailsSection trip={tripData} />
      </main>
    );
  } catch (e: any) {
    return (
      <div className="w-screen h-screen text-center flex flex-col gap-4 justify-center items-center">
        <h1 className="text-2xl text-center">{e.message}</h1>
        <p>Der er sket en fejl</p>
        <a className="bg-[#CBD29E] px-6 py-4 rounded" href="/">
          Gå tilbage til forsiden
        </a>
      </div>
    );
  }
}
