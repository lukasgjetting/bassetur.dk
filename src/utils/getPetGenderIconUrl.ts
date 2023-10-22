import { Stay } from "./types";

const getPetGenderIconUrl = (petGender: Stay['pets'][number]['gender']) => {
    switch (petGender) {
        case 'male':
            return '/icons/male.png';
        case 'female':
            return '/icons/female.png';
        default:
            petGender satisfies never;
            return '/icons/unknown.png';
    }
};

export default getPetGenderIconUrl;