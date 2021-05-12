export interface NavigatorSearchViewProps
{
    onSendSearch: (code: string, data: string) => void;
}

export interface INavigatorSearchFilter
{
    name: string;
    query: string;
}
