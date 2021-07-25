import { CatalogPageComposer, ICatalogPageData } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { SendMessageHook } from '../../../../../hooks/messages/message-event';
import { CatalogMode } from '../../../CatalogView.types';
import { useCatalogContext } from '../../../context/CatalogContext';
import { CatalogIconView } from '../../catalog-icon/CatalogIconView';
import { CatalogNavigationSetView } from '../set/CatalogNavigationSetView';
import { CatalogNavigationItemViewProps } from './CatalogNavigationItemView.types';

export const CatalogNavigationItemView: FC<CatalogNavigationItemViewProps> = props =>
{
    const { page = null, isActive = false, pendingTree = null, setPendingTree = null, setActiveChild = null } = props;
    const [ isExpanded, setIsExpanded ] = useState(false);
    const { dispatchCatalogState = null } = useCatalogContext();

    const select = useCallback((selectPage: ICatalogPageData) =>
    {
        if(!selectPage) return;
        
        setActiveChild(prevValue =>
            {
                if(prevValue === selectPage)
                {
                    SendMessageHook(new CatalogPageComposer(selectPage.pageId, -1, CatalogMode.MODE_NORMAL));
                }
                
                return selectPage;
            });

        if(selectPage.children && selectPage.children.length)
        {
            setIsExpanded(prevValue =>
                {
                    return !prevValue;
                });
        }
    }, [ setActiveChild ]);

    useEffect(() =>
    {
        if(!isActive || !page) return;

        setIsExpanded(true);
        
        SendMessageHook(new CatalogPageComposer(page.pageId, -1, CatalogMode.MODE_NORMAL));
    }, [ isActive, page, select, dispatchCatalogState ]);

    useEffect(() =>
    {
        if(!page || !pendingTree || !pendingTree.length) return;

        const index = pendingTree.indexOf(page);

        if(index === -1) return;

        //if(!pendingTree.length) setPendingTree(null);

        select(page);
    }, [ pendingTree, page, select, setPendingTree ]);
    
    return (
        <div className="col pb-1 catalog-navigation-item-container">
            <div className={ 'd-flex align-items-center cursor-pointer catalog-navigation-item ' + (isActive ? 'active ': '') } onClick={ event => select(page) }>
                <CatalogIconView icon={ page.icon } />
                <div className="flex-grow-1 text-black text-truncate px-1">{ page.localization }</div>
                { (page.children.length > 0) && <i className={ 'fas fa-caret-' + (isExpanded ? 'up' : 'down') } /> }
            </div>
            { isActive && isExpanded && page.children && (page.children.length > 0) &&
                <div className="d-flex flex-column mt-1">
                    <CatalogNavigationSetView page={ page } pendingTree={ pendingTree } setPendingTree={ setPendingTree } />
                </div> }
        </div>
    );
}
