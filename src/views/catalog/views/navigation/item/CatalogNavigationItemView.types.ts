import { ICatalogPageData } from 'nitro-renderer';
import { Dispatch, SetStateAction } from 'react';

export interface CatalogNavigationItemViewProps
{
    page: ICatalogPageData;
    isActive: boolean;
    pendingTree: ICatalogPageData[];
    setPendingTree: Dispatch<SetStateAction<ICatalogPageData[]>>;
    setActiveChild: Dispatch<SetStateAction<ICatalogPageData>>;
}
