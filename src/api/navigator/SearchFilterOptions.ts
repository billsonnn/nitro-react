import { INavigatorSearchFilter } from './INavigatorSearchFilter';

export const SearchFilterOptions: INavigatorSearchFilter[] = [
    {
        name: 'anything',
        query: null
    },
    {
        name: 'room.name',
        query: 'roomname'
    },
    {
        name: 'owner',
        query: 'owner'
    },
    {
        name: 'tag',
        query: 'tag'
    },
    {
        name: 'group',
        query: 'group'
    }
];
