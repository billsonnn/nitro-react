import { NavigatorSearchResultList } from '@nitrots/nitro-renderer';

export interface NavigatorSearchResultViewProps
{
    searchResult: NavigatorSearchResultList;
}

export class NavigatorSearchResultViewDisplayMode
{
    public static readonly LIST: number                 = 0;
    public static readonly THUMBNAILS: number           = 1;
    public static readonly FORCED_THUMBNAILS: number    = 2;
}
