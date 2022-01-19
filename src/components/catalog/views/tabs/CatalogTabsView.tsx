import { Dispatch, FC, SetStateAction } from 'react';
import { NitroCardTabsItemView } from '../../../../layout';
import { ICatalogNode } from '../../common/ICatalogNode';

interface CatalogTabsViewsProps
{
    node: ICatalogNode;
    currentTab: ICatalogNode;
    setCurrentTab: Dispatch<SetStateAction<ICatalogNode>>;
}

export const CatalogTabsViews: FC<CatalogTabsViewsProps> = props =>
{
    const { node = null, currentTab = null, setCurrentTab = null } = props;

    return (
        <>
            { node && (node.children.length > 0) && node.children.map(child =>
                {
                    if(!child.isVisible) return null;

                    return (
                        <NitroCardTabsItemView key={ child.pageId } isActive={ (currentTab === child) } onClick={ event => setCurrentTab(child) }>
                            { child.localization }
                        </NitroCardTabsItemView>
                    );
                }) }
        </>
    );
}
