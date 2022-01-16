import { IFurnitureData, IProductData } from '@nitrots/nitro-renderer';
import { IProduct } from './IProduct';
import { ProductTypeEnum } from './ProductTypeEnum';

export class Product implements IProduct
{
    public static EFFECT_CLASSID_NINJA_DISAPPEAR: number = 108;

    private _productType: string;
    private _productClassId: number;
    private _extraParam: string;
    private _productCount: number;
    private _productData: IProductData;
    private _furnitureData: IFurnitureData;
    private _isUniqueLimitedItem: boolean;
    private _uniqueLimitedItemSeriesSize: number;
    private _uniqueLimitedItemsLeft: number;

    constructor(productType: string, productClassId: number, extraParam: string, productCount: number, productData: IProductData, furnitureData: IFurnitureData, isUniqueLimitedItem: boolean = false, uniqueLimitedItemSeriesSize: number = 0, uniqueLimitedItemsLeft: number = 0)
    {
        this._productType = productType;
        this._productClassId = productClassId;
        this._extraParam = extraParam;
        this._productCount = productCount;
        this._productData = productData;
        this._furnitureData = furnitureData;
        this._isUniqueLimitedItem = isUniqueLimitedItem;
        this._uniqueLimitedItemSeriesSize = uniqueLimitedItemSeriesSize;
        this._uniqueLimitedItemsLeft = uniqueLimitedItemsLeft;
    }

    public static stripAddonProducts(products: IProduct[]): IProduct[]
    {
        if(products.length === 1) return products;

        return products.filter(product => ((product.productType !== ProductTypeEnum.BADGE) && (product.productType !== ProductTypeEnum.EFFECT) && (product.productClassId !== Product.EFFECT_CLASSID_NINJA_DISAPPEAR)));
    }

    public get productType(): string
    {
        return this._productType;
    }

    public get productClassId(): number
    {
        return this._productClassId;
    }

    public get extraParam(): string
    {
        return this._extraParam;
    }

    public set extraParam(extraParam: string)
    {
        this._extraParam = extraParam;
    }

    public get productCount(): number
    {
        return this._productCount;
    }

    public get productData(): IProductData
    {
        return this._productData;
    }

    public get furnitureData(): IFurnitureData
    {
        return this._furnitureData;
    }

    public get isUniqueLimitedItem(): boolean
    {
        return this._isUniqueLimitedItem;
    }

    public get uniqueLimitedItemSeriesSize(): number
    {
        return this._uniqueLimitedItemSeriesSize;
    }

    public get uniqueLimitedItemsLeft(): number
    {
        return this._uniqueLimitedItemsLeft;
    }

    public set uniqueLimitedItemsLeft(uniqueLimitedItemsLeft: number)
    {
        this._uniqueLimitedItemsLeft = uniqueLimitedItemsLeft;
    }
}
