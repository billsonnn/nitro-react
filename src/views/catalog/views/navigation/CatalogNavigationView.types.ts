import { INodeData } from '@nitrots/nitro-renderer';
import { Dispatch, SetStateAction } from 'react';

export interface CatalogNavigationViewProps
{
    page: INodeData;
    pendingTree: INodeData[];
    setPendingTree: Dispatch<SetStateAction<INodeData[]>>;
}
