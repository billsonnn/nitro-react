import { NavigatorSearchResultList } from 'nitro-renderer';

export interface NavigatorResultListViewProps
{
    resultList: NavigatorSearchResultList;
}

export class NavigatorResultListViewDisplayMode
{
    public static readonly LIST: number                 = 0;
    public static readonly THUMBNAILS: number           = 1;
    public static readonly FORCED_THUMBNAILS: number    = 2;
}
