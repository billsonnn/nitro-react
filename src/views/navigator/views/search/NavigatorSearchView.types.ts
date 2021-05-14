export interface NavigatorSearchViewProps
{
    sendSearch: (searchValue: string, contextCode: string) => void;
}

export interface INavigatorSearchFilter
{
    name: string;
    query: string;
}

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
