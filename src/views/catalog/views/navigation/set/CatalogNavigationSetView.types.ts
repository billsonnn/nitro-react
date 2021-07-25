import { ICatalogPageData } from 'nitro-renderer';
import { Dispatch, SetStateAction } from 'react';

export interface CatalogNavigationSetViewProps
{
    page: ICatalogPageData;
    isFirstSet?: boolean;
    pendingTree: ICatalogPageData[];
    setPendingTree: Dispatch<SetStateAction<ICatalogPageData[]>>;
}
