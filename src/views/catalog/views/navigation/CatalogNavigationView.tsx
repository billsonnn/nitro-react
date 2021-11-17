import { INodeData } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { NitroCardGridView, NitroLayoutFlexColumn } from '../../../../layout';
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
        <NitroLayoutFlexColumn className="h-100" gap={ 2 } overflow="auto">
            <CatalogSearchView />
            <NitroLayoutFlexColumn className="nitro-catalog-navigation-grid-container p-1 h-100" overflow="hidden">
                <NitroCardGridView columns={ 1 } gap={ 1 }>
                    <CatalogNavigationSetView page={ page } isFirstSet={ true } pendingTree={ pendingTree } setPendingTree={ setPendingTree } />
                </NitroCardGridView>
            </NitroLayoutFlexColumn>
        </NitroLayoutFlexColumn>
    );
}
