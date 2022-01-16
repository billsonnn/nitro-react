import { ICatalogNode } from './ICatalogNode';

export const FilterCatalogNode = (search: string, furniLines: string[], node: ICatalogNode, nodes: ICatalogNode[]) =>
{
    if(node.isVisible && (node.pageId > 0))
    {
        let nodeAdded = false;
        
        const hayStack = [ node.pageName, node.localization ].join(' ').toLowerCase().replace(/ /gi, '');

        if(hayStack.indexOf(search) > -1)
        {
            nodes.push(node);

            nodeAdded = true;
        }

        if(!nodeAdded)
        {
            for(const furniLine of furniLines)
            {
                if(hayStack.indexOf(furniLine) >= 0)
                {
                    nodes.push(node);

                    break;
                }
            }
        }
    }

    for(const child of node.children) FilterCatalogNode(search, furniLines, child, nodes);
}
