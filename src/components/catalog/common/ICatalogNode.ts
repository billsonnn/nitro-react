export interface ICatalogNode 
{
    addChild(node: ICatalogNode): void;
    readonly isOpen: boolean;
    readonly depth: number;
    readonly isBranch: boolean;
    readonly isLeaf: boolean;
    readonly localization: string;
    readonly pageId: number;
    readonly pageName: string;
    readonly iconId: number;
    readonly children: ICatalogNode[];
    readonly offerIds: number[];
    readonly parent: ICatalogNode;
    readonly isVisible: boolean;
}
