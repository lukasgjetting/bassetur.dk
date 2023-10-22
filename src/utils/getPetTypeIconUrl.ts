import { Stay } from "./types";

const getPetTypeIconUrl = (petType: Stay["pets"][number]["type"]) => {
  switch (petType) {
    case "cat":
      return "/icons/cat.png";
    case "dog":
      return "/icons/dog.png";
    default:
      petType satisfies never;
      return "/icons/unknown.png";
  }
};

export default getPetTypeIconUrl;
