import { ICatalogNode } from './ICatalogNode';
import { IPurchasableOffer } from './IPurchasableOffer';

export class SearchResult
{
    constructor(
        public readonly searchValue: string,
        public readonly offers: IPurchasableOffer[],
        public readonly filteredNodes: ICatalogNode[])
    {}
}
