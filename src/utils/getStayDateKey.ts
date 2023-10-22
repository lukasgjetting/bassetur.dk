import { DateTime } from "luxon";
import { Stay } from "./types";

const getStayDateKey = (stay: Stay, date: DateTime) =>
  `stay-${stay.id}-${date.toISODate()}`;

export default getStayDateKey;
