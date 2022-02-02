import { FC } from 'react';
import { Column } from '../../../../common/Column';
import { Grid } from '../../../../common/Grid';
import { useCatalogContext } from '../../CatalogContext';
import { ICatalogNode } from '../../common/ICatalogNode';
import { CatalogSearchView } from '../page/common/CatalogSearchView';
import { CatalogNavigationItemView } from './CatalogNavigationItemView';
import { CatalogNavigationSetView } from './CatalogNavigationSetView';

export interface CatalogNavigationViewProps
{
    node: ICatalogNode;
}

export const CatalogNavigationView: FC<CatalogNavigationViewProps> = props =>
{
    const { node = null } = props;
    const { searchResult = null } = useCatalogContext();
    
    return (
        <>
            <CatalogSearchView />
            <Column fullHeight className="nitro-catalog-navigation-grid-container p-1" overflow="hidden">
                <Grid grow columnCount={ 1 } gap={ 1 } overflow="auto">
                    { searchResult && (searchResult.filteredNodes.length > 0) && searchResult.filteredNodes.map((n, index) =>
                    {
                        return <CatalogNavigationItemView key={ index } node={ n } />;
                    })}
                    { !searchResult &&
                        <CatalogNavigationSetView node={ node } /> }
                </Grid>
            </Column>
        </>
    );
}
