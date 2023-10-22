import { Trip } from "@/utils/types";
import { kv } from "@vercel/kv";

const main = async () => {
  const tripKey = process.argv[2];

  if (tripKey == null) {
    console.log(
      "Please provide a trip key as an argument (`yarn publish-trip <trip-key>`)",
    );
    process.exit(1);
  }

  console.log(`Publishing trip ${tripKey}`);

  const tripData = (await import(`../trip-data/${tripKey}.ts`)).default as Trip;

  const key = `trips-${tripKey}`;
  const existingTripData = await kv.get(key);

  if (existingTripData == null) {
    console.log(`Creating new trip: ${tripKey}`);
  } else {
    const backupKey = `${key}-${new Date().toISOString()}`;
    console.log(`Updating trip, saving old version in key \`${backupKey}\``);
    await kv.set(backupKey, existingTripData);
    console.log("Saved backup");
  }

  await kv.set(key, JSON.stringify(tripData));
  console.log("Published new trip data");
};

main();
