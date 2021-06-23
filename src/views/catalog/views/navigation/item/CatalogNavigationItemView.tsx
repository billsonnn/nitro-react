import { FC, useCallback, useEffect, useState } from 'react';
import { GetCatalogPageComposer } from '../../../../../api/catalog/GetCatalogPageComposer';
import { SendMessageHook } from '../../../../../hooks/messages/message-event';
import { CatalogMode } from '../../../CatalogView.types';
import { CatalogIconView } from '../../catalog-icon/CatalogIconView';
import { CatalogNavigationSetView } from '../set/CatalogNavigationSetView';
import { CatalogNavigationItemViewProps } from './CatalogNavigationItemView.types';

export const CatalogNavigationItemView: FC<CatalogNavigationItemViewProps> = props =>
{
    const { page = null, isActive = false, setActiveChild = null } = props;
    const [ isExpanded, setIsExpanded ] = useState(false);

    useEffect(() =>
    {
        if(!isActive || !page) return;

        setIsExpanded(true);

        SendMessageHook(GetCatalogPageComposer(page.pageId, -1, CatalogMode.MODE_NORMAL));
    }, [ isActive, page ]);

    const select = useCallback(() =>
    {
        if(!page) return;
        
        setActiveChild(prevValue =>
            {
                if(prevValue === page)
                {
                    SendMessageHook(GetCatalogPageComposer(page.pageId, -1, CatalogMode.MODE_NORMAL));
                }
                
                return page;
            });

        if(page.children && page.children.length)
        {
            setIsExpanded(prevValue =>
                {
                    return !prevValue;
                });
        }
    }, [ page, setActiveChild ]);
    
    return (
        <div className="col pe-1 pb-1 catalog-navigation-item-container">
            <div className={ 'd-flex align-items-center cursor-pointer catalog-navigation-item ' + (isActive ? 'active ': '') } onClick={ select }>
                <CatalogIconView icon={ page.icon } />
                <div className="flex-grow-1 text-black text-truncate px-1">{ page.localization }</div>
                { (page.children.length > 0) && <i className={ 'fas fa-caret-' + (isExpanded ? 'up' : 'down') } /> }
            </div>
            { isActive && isExpanded && page.children && (page.children.length > 0) &&
                <div className="d-flex flex-column mt-1">
                    <CatalogNavigationSetView page={ page } />
                </div> }
        </div>
    );
}
