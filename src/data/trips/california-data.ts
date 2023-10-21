import { Trip } from "@/utils/types";

export const CaliforniaData: Trip = {
    id: 'california',
    startDate: '2023-10-11',
    endDate: '2023-12-20',
    stays: [
        {
            id: 'sebastopol',
            location: 'Sebastopol',
            endDate: '2023-10-15',
            imageSourceUrl: '/california/stays/sebastopol.jpg',
            color: '#F0C78D',
            funFacts: [
                'Ginger og Merlin er mor og far til Bear og Tiger Lily',
            ],
            pets: [
                {
                    id: 'calypso',
                    name: 'Calypso',
                    age: '15 år',
                    race: 'Ragdoll',
                    type: 'cat',
                    imageSourceUrl: '/california/pets/calypso.jpg',
                },
                {
                    id: 'ginger',
                    name: 'Ginger',
                    age: '5 år',
                    race: 'Ragdoll',
                    type: 'cat',
                    imageSourceUrl: '/california/pets/ginger.jpg',
                },
                {
                    id: 'merlin',
                    name: 'Merlin',
                    age: '4 år',
                    race: 'Ragdoll',
                    type: 'cat',
                    imageSourceUrl: '/california/pets/merlin.jpg',
                },
                {
                    id: 'bear',
                    name: 'Bear',
                    age: '3 år',
                    race: 'Ragdoll',
                    type: 'cat',
                    imageSourceUrl: '/california/pets/bear.jpg',
                },
                {
                    id: 'tiger-lily',
                    name: 'Tiger Lily',
                    age: '3 år',
                    race: 'Ragdoll',
                    type: 'cat',
                    imageSourceUrl: '/california/pets/tiger-lily.jpg',
                },
            ],
            imagesByDate: {
                '2023-10-11': ['/california/stays/images/asfd.jpg'],
                '2023-10-14': ['/california/stays/images/asfd.jpg'],
            },
        },
        {
            id: 'oakland',
            location: 'Oakland',
            endDate: '2023-10-20',
            imageSourceUrl: '/california/stays/oakland.jpg',
            color: '#DDA97B',
            funFacts: [
                'Mika blev fundet på gaden',
            ],
            pets: [
                {
                    id: 'mika',
                    name: 'Mika',
                    age: '8 måneder',
                    race: 'Mix',
                    type: 'dog',
                    imageSourceUrl: '/california/pets/mika.jpg',
                },
            ],
            imagesByDate: {
                '2023-10-20': ['/california/stays/images/asfd.jpg'],
            },
        },
        {
            id: 'san-francisco-nob',
            location: 'San Francisco',
            endDate: '2023-10-26',
            imageSourceUrl: '/california/stays/san-francisco-nob.jpg',
            color: '#F0C6B4',
            funFacts: [],
            pets: [],
            imagesByDate: {

            },
        },
    ],
};