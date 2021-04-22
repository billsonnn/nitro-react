export interface FriendListViewProps
{}

export interface IFriendListContext
{
    currentTab: string;
    onSetCurrentTab: (tab: string) => void;
}

export class FriendListTabs
{
    public static readonly FRIENDS: string  = 'friendlist.friends';
    public static readonly REQUESTS: string = 'friendlist.requests';
    public static readonly SEARCH: string   = 'generic.search';
}
