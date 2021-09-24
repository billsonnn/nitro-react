import { INodeData } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { NitroCardGridView } from '../../../../layout';
import { CatalogSearchView } from '../search/CatalogSearchView';
import { CatalogNavigationViewProps } from './CatalogNavigationView.types';
import { CatalogNavigationSetView } from './set/CatalogNavigationSetView';

export let ACTIVE_PAGES: INodeData[] = [];

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
        <div className="row h-100">
            <div className="d-flex flex-column col gap-2 h-100">
                <CatalogSearchView />
                <div className="d-flex flex-column overflow-hidden nitro-catalog-navigation-grid p-1 h-100">
                    <NitroCardGridView columns={ 1 } gap={ 1 }>
                        <CatalogNavigationSetView page={ page } isFirstSet={ true } pendingTree={ pendingTree } setPendingTree={ setPendingTree } />
                    </NitroCardGridView>
                </div>
            </div>
        </div>
    );
}
