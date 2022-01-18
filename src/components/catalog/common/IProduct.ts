import { IFurnitureData, IProductData } from '@nitrots/nitro-renderer';
import { IPurchasableOffer } from './IPurchasableOffer';

export interface IProduct
{
    getIconUrl(offer?: IPurchasableOffer): string;
    readonly productType: string;
    readonly productClassId: number;
    readonly extraParam: string;
    readonly productCount: number;
    readonly productData: IProductData;
    readonly furnitureData: IFurnitureData;
    readonly isUniqueLimitedItem: boolean;
    readonly uniqueLimitedItemSeriesSize: number;
    uniqueLimitedItemsLeft: number;
}
