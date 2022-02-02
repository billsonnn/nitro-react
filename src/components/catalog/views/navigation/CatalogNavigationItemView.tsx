import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { LayoutGridItem } from '../../../../common/layout/LayoutGridItem';
import { Text } from '../../../../common/Text';
import { useCatalogContext } from '../../CatalogContext';
import { ICatalogNode } from '../../common/ICatalogNode';
import { CatalogIconView } from '../catalog-icon/CatalogIconView';
import { CatalogNavigationSetView } from './CatalogNavigationSetView';

export interface CatalogNavigationItemViewProps
{
    node: ICatalogNode;
}

export const CatalogNavigationItemView: FC<CatalogNavigationItemViewProps> = props =>
{
    const { node = null } = props;
    const { activateNode = null } = useCatalogContext();
    
    return (
        <>
            <LayoutGridItem gap={ 1 } column={ false } itemActive={ node.isActive } onClick={ event => activateNode(node) }>
                <CatalogIconView icon={ node.iconId } />
                <Text grow truncate>{ node.localization }</Text>
                { node.isBranch &&
                    <FontAwesomeIcon icon={ node.isOpen ? 'caret-up' : 'caret-down' } /> }
            </LayoutGridItem>
            { node.isOpen && node.isBranch &&
                <CatalogNavigationSetView node={ node } /> }
        </>
    );
}
