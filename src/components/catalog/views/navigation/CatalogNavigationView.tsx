import { FC } from 'react';
import { ICatalogNode } from '../../../../api';
import { AutoGrid, Column } from '../../../../common';
import { useCatalog } from '../../../../hooks';
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
    const { searchResult = null } = useCatalog();

    return (
        <>
            <CatalogSearchView />
            <Column fullHeight className="!border-[#b6bec5] bg-[#cdd3d9] border-[2px] border-[solid] rounded p-1" overflow="hidden">
                <AutoGrid columnCount={ 1 } gap={ 1 } id="nitro-catalog-main-navigation">
                    { searchResult && (searchResult.filteredNodes.length > 0) && searchResult.filteredNodes.map((n, index) =>
                    {
                        return <CatalogNavigationItemView key={ index } node={ n } />;
                    }) }
                    { !searchResult &&
                        <CatalogNavigationSetView node={ node } /> }
                </AutoGrid>
            </Column>
        </>
    );
};
