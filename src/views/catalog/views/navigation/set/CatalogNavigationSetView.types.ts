import { INodeData } from '@nitrots/nitro-renderer';
import { Dispatch, SetStateAction } from 'react';

export interface CatalogNavigationSetViewProps
{
    page: INodeData;
    isFirstSet?: boolean;
    pendingTree: INodeData[];
    setPendingTree: Dispatch<SetStateAction<INodeData[]>>;
}
