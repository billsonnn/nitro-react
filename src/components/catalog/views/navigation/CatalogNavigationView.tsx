import { FC, useCallback, useState } from 'react';
import { Column } from '../../../../common/Column';
import { Grid } from '../../../../common/Grid';
import { FilterCatalogNode } from '../../common/FilterCatalogNode';
import { ICatalogNode } from '../../common/ICatalogNode';
import { useCatalogContext } from '../../context/CatalogContext';
import { CatalogSearchView } from '../search/CatalogSearchView';
import { CatalogNavigationSetView } from './CatalogNavigationSetView';

export interface CatalogNavigationViewProps
{
    node: ICatalogNode;
}

export const CatalogNavigationView: FC<CatalogNavigationViewProps> = props =>
{
    const { node = null } = props;
    const [ filteredNodes, setFilteredNodes ] = useState<ICatalogNode[]>([]);
    const { currentNode = null, activeNodes = null } = useCatalogContext();

    const filterNodes = useCallback((value: string, furniLines: string[]) =>
    {
        const nodes: ICatalogNode[] = [];

        FilterCatalogNode(value, furniLines, currentNode, nodes);

        setFilteredNodes(nodes.filter(node => (node.isVisible)));
    }, [ currentNode ]);
    
    return (
        <>
            <CatalogSearchView />
            <Column fullHeight className="nitro-catalog-navigation-grid-container p-1" overflow="hidden">
                <Grid grow columnCount={ 1 } gap={ 1 } overflow="auto">
                    {/* { filterNodes && (filteredNodes.length > 0) && filteredNodes.map((node, index) =>
                    {
                        return <CatalogNavigationItemView key={ index } node={ node } isActive={ (activeNodes.indexOf(node) > -1) } selectNode={ selectNode } />;
                    })} */}
                    <CatalogNavigationSetView node={ node } />
                </Grid>
            </Column>
        </>
    );
}
