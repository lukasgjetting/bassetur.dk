import { DateTime } from "luxon";
import { Stay } from "./types";

const getCurrentStay = (stays: Stay[], d: DateTime = DateTime.now()) =>
  stays.find(
    (stay) => d.valueOf() - DateTime.fromISO(stay.endDate).valueOf() <= 0,
  );

export default getCurrentStay;
