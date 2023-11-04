export type Stay = {
  id: string;
  endDate: `${number}-${number}-${number}`;
  location: string;
  transport: "car" | "bus" | "train" | "plane" | null;
  imageSourceUrl: string | null;
  color: string;
  pets: Array<{
    id: string;
    type: "cat" | "dog";
    name: string;
    race: string;
    age: string;
    gender: "male" | "female";
    imageSourceUrl: string;
  }>;
  funFacts: string[];
  dates: Record<
    string,
    {
      title: string;
      content: Array<{
        type: "text" | "image" | "video";
        value: string;
      }>;
    }
  >;
};

export type Trip = {
  id: string;
  startDate: `${number}-${number}-${number}`;
  endDate: `${number}-${number}-${number}`;
  stays: Stay[];
};
