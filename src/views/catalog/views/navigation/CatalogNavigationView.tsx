import { ICatalogPageData } from 'nitro-renderer';
import { FC, useEffect } from 'react';
import { CatalogSearchView } from '../search/CatalogSearchView';
import { CatalogNavigationViewProps } from './CatalogNavigationView.types';
import { CatalogNavigationSetView } from './set/CatalogNavigationSetView';

export let ACTIVE_PAGES: ICatalogPageData[] = [];

export const CatalogNavigationView: FC<CatalogNavigationViewProps> = props =>
{
    const { page = null } = props;

    useEffect(() =>
    {
        if(!page) return;

        ACTIVE_PAGES = [ page ];
    }, [ page ]);
    
    return (
        <>
            <CatalogSearchView />
            <div className="border border-2 rounded overflow-hidden nitro-catalog-navigation">
                <div className="navigation-container m-1">
                    <CatalogNavigationSetView page={ page } isFirstSet={ true } />
                </div>
            </div>
        </>
    );
}
