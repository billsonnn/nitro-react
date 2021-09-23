import { INodeData } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { CatalogNavigationItemView } from '../item/CatalogNavigationItemView';
import { CatalogNavigationSetViewProps } from './CatalogNavigationSetView.types';

export const CatalogNavigationSetView: FC<CatalogNavigationSetViewProps> = props =>
{
    const { page = null, isFirstSet = false, pendingTree = null, setPendingTree = null } = props;
    const [ activeChild, setActiveChild ] = useState<INodeData>(null);

    useEffect(() =>
    {
        if(!page || (page.pageId === -1) || !isFirstSet || pendingTree) return;

        if(page.children.length)
        {
            if(activeChild)
            {
                if(page.children.indexOf(activeChild) === -1) setActiveChild(null);
                
                return;
            }
            
            setActiveChild(page.children[0]);
        }
    }, [ page, isFirstSet, activeChild, pendingTree ]);
    
    return (
        <>
            { page && (page.children.length > 0) && page.children.map((page, index) =>
                {
                    if(!page.visible) return null;
                    
                    return <CatalogNavigationItemView key={ index } page={ page } isActive={ (activeChild === page) } pendingTree={ pendingTree } setPendingTree={ setPendingTree } setActiveChild={ setActiveChild } />
                }) }
        </>
    );
}
