import { ICatalogPageData } from 'nitro-renderer';
import { Dispatch, SetStateAction } from 'react';

export interface CatalogNavigationItemViewProps
{
    page: ICatalogPageData;
    isActive: boolean;
    setActiveChild: Dispatch<SetStateAction<ICatalogPageData>>;
}
