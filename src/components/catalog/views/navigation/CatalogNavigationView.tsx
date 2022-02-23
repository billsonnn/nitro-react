import { FC } from 'react';
import { AutoGrid } from '../../../../common/AutoGrid';
import { Column } from '../../../../common/Column';
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
            <Column fullHeight className="nitro-catalog-navigation-grid-container rounded p-1" overflow="hidden">
                <AutoGrid gap={ 1 } columnCount={ 1 }>
                    { searchResult && (searchResult.filteredNodes.length > 0) && searchResult.filteredNodes.map((n, index) =>
                    {
                        return <CatalogNavigationItemView key={ index } node={ n } />;
                    })}
                    { !searchResult &&
                        <CatalogNavigationSetView node={ node } /> }
                </AutoGrid>
            </Column>
        </>
    );
}
