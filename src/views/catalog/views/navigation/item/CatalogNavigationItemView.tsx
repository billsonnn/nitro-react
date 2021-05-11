import { FC, useEffect } from 'react';
import { GetCatalogPageComposer } from '../../../../../api/catalog/GetCatalogPageComposer';
import { SendMessageHook } from '../../../../../hooks/messages/message-event';
import { CatalogIconView } from '../../../../catalog-icon/CatalogIconView';
import { CatalogMode } from '../../../CatalogView.types';
import { CatalogNavigationSetView } from '../set/CatalogNavigationSetView';
import { CatalogNavigationItemViewProps } from './CatalogNavigationItemView.types';

export const CatalogNavigationItemView: FC<CatalogNavigationItemViewProps> = props =>
{
    const { page = null, isActive = false, setActiveChild = null } = props;

    useEffect(() =>
    {
        if(!isActive || !page) return;

        SendMessageHook(GetCatalogPageComposer(page.pageId, -1, CatalogMode.MODE_NORMAL));
    }, [ isActive, page ]);

    function select(): void
    {
        if(!page) return;
        
        setActiveChild(prevValue =>
            {
                if(prevValue === page) return null;
                
                return page;
            });
    }
    
    return (
        <div className="col pe-1 pb-1 catalog-navigation-item-container">
            <div className={ 'd-flex align-items-center cursor-pointer catalog-navigation-item ' + (isActive ? 'active ': '') } onClick={ select }>
                <CatalogIconView icon={ page.icon } />
                <div className="flex-grow-1 text-black text-truncate px-1">{ page.localization }</div>
                { (page.children.length > 0) && <i className={ 'fas fa-caret-' + (isActive ? 'up' : 'down') } /> }
            </div>
            { isActive && page.children && (page.children.length > 0) &&
                <div className="d-flex flex-column mt-1">
                    <CatalogNavigationSetView page={ page } />
                </div> }
        </div>
    );
}
