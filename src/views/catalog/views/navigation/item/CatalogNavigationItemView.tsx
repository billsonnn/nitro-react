import { GetCatalogPageComposer, INodeData } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { SendMessageHook } from '../../../../../hooks/messages/message-event';
import { NitroCardGridItemView } from '../../../../../layout';
import { CatalogMode } from '../../../CatalogView.types';
import { CatalogIconView } from '../../catalog-icon/CatalogIconView';
import { ACTIVE_PAGES } from '../CatalogNavigationView';
import { CatalogNavigationSetView } from '../set/CatalogNavigationSetView';
import { CatalogNavigationItemViewProps } from './CatalogNavigationItemView.types';

export const CatalogNavigationItemView: FC<CatalogNavigationItemViewProps> = props =>
{
    const { page = null, isActive = false, pendingTree = null, setPendingTree = null, setActiveChild = null } = props;
    const [ isExpanded, setIsExpanded ] = useState(false);

    const select = useCallback((selectPage: INodeData, expand: boolean = false) =>
    {
        if(!selectPage) return;
        
        setActiveChild(prevValue =>
            {
                if(prevValue === selectPage)
                {
                    if(selectPage.pageId > -1) SendMessageHook(new GetCatalogPageComposer(selectPage.pageId, -1, CatalogMode.MODE_NORMAL));
                }
                
                return selectPage;
            });

        if(selectPage.children && selectPage.children.length)
        {
            setIsExpanded(prevValue =>
                {
                    if(expand) return true;
                    
                    return !prevValue;
                });
        }
    }, [ setActiveChild ]);

    useEffect(() =>
    {
        if(!pendingTree || !pendingTree.length) return;

        if(page !== pendingTree[0]) return;

        const newTree = [ ...pendingTree ];

        newTree.shift();

        if(newTree.length) setPendingTree(newTree);
        else setPendingTree(null);

        select(page, true);
    }, [ page, pendingTree, setPendingTree, select ]);

    useEffect(() =>
    {
        if(!isActive || !page) return;

        setIsExpanded(true);

        if(page.pageId > -1) SendMessageHook(new GetCatalogPageComposer(page.pageId, -1, CatalogMode.MODE_NORMAL));

        const index = (ACTIVE_PAGES.push(page) - 1);

        return () =>
        {
            ACTIVE_PAGES.length = index;
        }
    }, [ isActive, page ]);
    
    return (
        <>
            <NitroCardGridItemView itemActive={ isActive } onClick={ event => select(page) }>
                <CatalogIconView icon={ page.icon } />
                <div className="flex-grow-1 text-black text-truncate">{ page.localization }</div>
                { (page.children.length > 0) && <i className={ 'fas fa-caret-' + (isExpanded ? 'up' : 'down') } /> }
            </NitroCardGridItemView>
            { isActive && isExpanded && page.children && (page.children.length > 0) &&
                <CatalogNavigationSetView page={ page } pendingTree={ pendingTree } setPendingTree={ setPendingTree } /> }
        </>
    );
}
