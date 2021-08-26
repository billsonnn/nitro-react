import { INodeData } from '@nitrots/nitro-renderer';
import { Dispatch, SetStateAction } from 'react';

export interface CatalogNavigationItemViewProps
{
    page: INodeData;
    isActive: boolean;
    pendingTree: INodeData[];
    setPendingTree: Dispatch<SetStateAction<INodeData[]>>;
    setActiveChild: Dispatch<SetStateAction<INodeData>>;
}
