import { ICatalogPageData } from 'nitro-renderer';
import { FC, useEffect } from 'react';
import { CatalogSearchView } from '../search/CatalogSearchView';
import { CatalogNavigationViewProps } from './CatalogNavigationView.types';
import { CatalogNavigationSetView } from './set/CatalogNavigationSetView';

export let ACTIVE_PAGES: ICatalogPageData[] = [];

export const CatalogNavigationView: FC<CatalogNavigationViewProps> = props =>
{
    const { page = null, pendingTree = null, setPendingTree = null } = props;

    useEffect(() =>
    {
        if(!page) return;

        ACTIVE_PAGES = [ page ];

        return () =>
        {
            ACTIVE_PAGES = [];
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
