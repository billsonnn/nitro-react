import { ICatalogPageData } from 'nitro-renderer';
import { FC, useEffect } from 'react';
import { CatalogSearchView } from '../search/CatalogSearchView';
import { CatalogNavigationViewProps } from './CatalogNavigationView.types';
import { CatalogNavigationSetView } from './set/CatalogNavigationSetView';

export const ACTIVE_PAGES: ICatalogPageData[] = [];

export const CatalogNavigationView: FC<CatalogNavigationViewProps> = props =>
{
    const { page = null, pendingTree = null, setPendingTree = null } = props;

    useEffect(() =>
    {
        if(!page) return;

        const index = (ACTIVE_PAGES.push(page) - 1);

        return () =>
        {
            ACTIVE_PAGES.splice(index, 1);
        }
    }, [ page ]);
    
    return (
        <>
            <CatalogSearchView />
            <div className="border border-2 rounded overflow-hidden nitro-catalog-navigation p-1 h-100">
                <div className="navigation-container h-100">
                    <CatalogNavigationSetView page={ page } isFirstSet={ true } pendingTree={ pendingTree } setPendingTree={ setPendingTree } />
                </div>
            </div>
        </>
    );
}
