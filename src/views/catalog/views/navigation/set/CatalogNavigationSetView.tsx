import { ICatalogPageData } from 'nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { CatalogNavigationItemView } from '../item/CatalogNavigationItemView';
import { CatalogNavigationSetViewProps } from './CatalogNavigationSetView.types';

export const CatalogNavigationSetView: FC<CatalogNavigationSetViewProps> = props =>
{
    const { page = null, isFirstSet = false } = props;
    const [ activeChild, setActiveChild ] = useState<ICatalogPageData>(null);

    useEffect(() =>
    {
        if(!isFirstSet) return;

        if(page && page.children.length) setActiveChild(page.children[0]);
    }, [ page, isFirstSet ]);
    
    return (
        <div className="row row-cols-1 g-0 catalog-navigation-set-container w-100">
            { page && (page.children.length > 0) && page.children.map((page, index) =>
                {
                    if(!page.visible) return null;
                    
                    return <CatalogNavigationItemView key={ index } page={ page } isActive={ (activeChild === page) } setActiveChild={ setActiveChild } />
                }) }
        </div>
    );
}
