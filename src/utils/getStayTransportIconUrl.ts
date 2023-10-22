import { Stay } from "./types";

const getStayTransportIconUrl = (transport: Stay["transport"]) => {
  switch (transport) {
    case "bus":
      return "/icons/basse-bus.png";
    case "car":
      return "/icons/basse-car.png";
    case "train":
      return "/icons/basse-train.png";
    case "plane":
      return "/icons/basse-plane.png";

    case null:
      return null;

    default:
      transport satisfies never;
      return "/icons/unknown.png";
  }
};

export default getStayTransportIconUrl;
