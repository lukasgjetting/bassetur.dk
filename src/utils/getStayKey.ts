import { DateTime } from "luxon";
import { Stay } from "./types";

const getStayKey = (stay: Stay) => `stay-${stay.id}`;

export default getStayKey;
