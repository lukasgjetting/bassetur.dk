export type Stay = {
    id: string;
    endDate: `${number}-${number}-${number}`;
    location: string;
    imageSourceUrl: string;
    color: string;
    pets: Array<{
        id: string;
        type: 'cat' | 'dog';
        name: string;
        race: string;
        age: string;
        imageSourceUrl: string;
    }>;
    funFacts: string[];
    imagesByDate: Record<string, string[]>;
};

export type Trip = {
    id: string;
    startDate: `${number}-${number}-${number}`;
    endDate: `${number}-${number}-${number}`;
    stays: Stay[];

};
