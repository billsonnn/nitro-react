import { ICatalogPageData } from 'nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { ACTIVE_PAGES } from '../CatalogNavigationView';
import { CatalogNavigationItemView } from '../item/CatalogNavigationItemView';
import { CatalogNavigationSetViewProps } from './CatalogNavigationSetView.types';

export const CatalogNavigationSetView: FC<CatalogNavigationSetViewProps> = props =>
{
    const { page = null, isFirstSet = false } = props;
    const [ activeChild, setActiveChild ] = useState<ICatalogPageData>(null);

    useEffect(() =>
    {
        if(!isFirstSet || !page || (page.pageId === -1)) return;

        if(page && page.children.length)
        {
            const child = page.children[0];

            setActiveChild(child);
        }
    }, [ page, isFirstSet ]);

    useEffect(() =>
    {
        if(!activeChild) return;

        const index = (ACTIVE_PAGES.push(activeChild) - 1);

        return () =>
        {
            ACTIVE_PAGES.splice(index, (ACTIVE_PAGES.length - index));
        }
    }, [ activeChild ]);
    
    return (
        <div className="row row-cols-1 g-0 catalog-navigation-set-container w-100">
            { page && (page.children.length > 0) && page.children.map(page =>
                {
                    if(!page.visible) return null;
                    
                    return <CatalogNavigationItemView key={ page.pageId } page={ page } isActive={ (activeChild === page) } setActiveChild={ setActiveChild } />
                }) }
        </div>
    );
}
