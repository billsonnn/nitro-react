import { INodeData } from '@nitrots/nitro-renderer';
import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { Column } from '../../../../common/Column';
import { Grid } from '../../../../common/Grid';
import { CatalogSearchView } from '../search/CatalogSearchView';
import { CatalogNavigationSetView } from './CatalogNavigationSetView';

export interface CatalogNavigationViewProps
{
    page: INodeData;
    pendingTree: INodeData[];
    setPendingTree: Dispatch<SetStateAction<INodeData[]>>;
}

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
        <>
            <CatalogSearchView />
            <Column fullHeight className="nitro-catalog-navigation-grid-container p-1" overflow="hidden">
                <Grid grow columnCount={ 1 } gap={ 1 } overflow="auto">
                    <CatalogNavigationSetView page={ page } isFirstSet={ true } pendingTree={ pendingTree } setPendingTree={ setPendingTree } />
                </Grid>
            </Column>
        </>
    );
}
