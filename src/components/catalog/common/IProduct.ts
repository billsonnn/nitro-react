import { IFurnitureData, IProductData } from '@nitrots/nitro-renderer';

export interface IProduct
{
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
