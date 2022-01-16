import { FC, useEffect, useState } from 'react';
import { UseMountEffect } from '../../../../hooks';
import { ICatalogNode } from '../../common/ICatalogNode';
import { useCatalogContext } from '../../context/CatalogContext';
import { CatalogNavigationItemView } from './CatalogNavigationItemView';

export interface CatalogNavigationSetViewProps
{
    node: ICatalogNode;
}

export const CatalogNavigationSetView: FC<CatalogNavigationSetViewProps> = props =>
{
    const { node = null } = props;
    const [ activeNode, setActiveNode ] = useState<ICatalogNode>(null);
    const { activeNodes = null, setActiveNodes = null } = useCatalogContext();

    const selectNode = (node: ICatalogNode) =>
    {
        setActiveNode(node);
    }

    useEffect(() =>
    {
        if(!node || !activeNode) return;

        setActiveNodes(prevValue =>
            {
                const newNodes = prevValue.slice(0, (node.depth - 1));

                newNodes.push(activeNode);

                return newNodes;
            });

        return () =>
        {
            setActiveNodes(prevValue =>
                {
                    const newNodes = prevValue.slice(0, (node.depth - 1));

                    return newNodes;
                });
        }
    }, [ node, activeNode, setActiveNodes ]);

    UseMountEffect(() =>
    {
        if(activeNodes && activeNodes.length)
        {
            const index = activeNodes.indexOf(node);

            if(index > -1)
            {
                const childNode = activeNodes[index + 1];

                if(childNode) setActiveNode(childNode);
            }
        }
    });
    
    return (
        <>
            { node && (node.children.length > 0) && node.children.map((node, index) =>
                {
                    if(!node.isVisible) return null;
                    
                    return <CatalogNavigationItemView key={ index } node={ node } isActive={ (activeNodes.indexOf(node) > -1) } selectNode={ selectNode } />
                }) }
        </>
    );
}
