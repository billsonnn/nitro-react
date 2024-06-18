import { FC } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { ICatalogNode } from '../../../../api';
import { LayoutGridItem, Text } from '../../../../common';
import { useCatalog } from '../../../../hooks';
import { CatalogIconView } from '../catalog-icon/CatalogIconView';
import { CatalogNavigationSetView } from './CatalogNavigationSetView';

export interface CatalogNavigationItemViewProps
{
    node: ICatalogNode;
    child?: boolean;
}

export const CatalogNavigationItemView: FC<CatalogNavigationItemViewProps> = props =>
{
    const { node = null, child = false } = props;
    const { activateNode = null } = useCatalog();

    return (
        <div className={ child ? 'pl-[5px] border-s-2 border-[#b6bec5]' : '' }>
            <LayoutGridItem className={ ' !h-[23px] bg-[#cdd3d9] !border-[0] px-[3px] py-px text-sm' } column={ false } gap={ 1 } itemActive={ node.isActive } onClick={ event => activateNode(node) }>
                <CatalogIconView icon={ node.iconId } />
                <Text truncate className="!flex-grow">{ node.localization }</Text>
                { node.isBranch &&
                    <>
                        { node.isOpen && <FaCaretUp className="fa-icon" /> }
                        { !node.isOpen && <FaCaretDown className="fa-icon" /> }
                    </> }
            </LayoutGridItem>
            { node.isOpen && node.isBranch &&
                <CatalogNavigationSetView child={ true } node={ node } /> }
        </div>
    );
};
