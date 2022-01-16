import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useEffect, useState } from 'react';
import { LayoutGridItem } from '../../../../common/layout/LayoutGridItem';
import { Text } from '../../../../common/Text';
import { BatchUpdates } from '../../../../hooks';
import { ICatalogNode } from '../../common/ICatalogNode';
import { useCatalogContext } from '../../context/CatalogContext';
import { CatalogIconView } from '../catalog-icon/CatalogIconView';
import { CatalogNavigationSetView } from './CatalogNavigationSetView';

export interface CatalogNavigationItemViewProps
{
    node: ICatalogNode;
    isActive: boolean;
    selectNode: (node: ICatalogNode) => void;
}

export const CatalogNavigationItemView: FC<CatalogNavigationItemViewProps> = props =>
{
    const { node = null, isActive = false, selectNode = null } = props;
    const [ isExpanded, setIsExpanded ] = useState(false);
    const { loadCatalogPage = null } = useCatalogContext();

    const select = () =>
    {
        BatchUpdates(() =>
        {
            if(!isActive) selectNode(node);
            else setIsExpanded(prevValue => !prevValue);

            loadCatalogPage(node.pageId, -1, true);
        });
    }

    useEffect(() =>
    {
        setIsExpanded(isActive);
    }, [ isActive ]);
    
    return (
        <>
            <LayoutGridItem column={ false } itemActive={ isActive } onClick={ select }>
                <CatalogIconView icon={ node.iconId } />
                <Text grow truncate>{ node.localization }</Text>
                { node.isBranch &&
                    <FontAwesomeIcon icon={ isExpanded ? 'caret-up' : 'caret-down' } /> }
            </LayoutGridItem>
            { isExpanded && node.isBranch &&
                <CatalogNavigationSetView node={ node } /> }
        </>
    );
}
