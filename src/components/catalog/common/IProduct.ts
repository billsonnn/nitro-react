import { IFurnitureData, IProductData } from '@nitrots/nitro-renderer';
import { IPurchasableOffer } from './IPurchasableOffer';

export interface IProduct
{
    getIconUrl(offer?: IPurchasableOffer): string;
    productType: string;
    productClassId: number;
    extraParam: string;
    productCount: number;
    productData: IProductData;
    furnitureData: IFurnitureData;
    isUniqueLimitedItem: boolean;
    uniqueLimitedItemSeriesSize: number;
    uniqueLimitedItemsLeft: number;
}
