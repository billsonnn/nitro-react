import { GetProductOfferComposer, IFurnitureData } from '@nitrots/nitro-renderer';
import { GetProductDataForLocalization, SendMessageComposer } from '../nitro';
import { ICatalogPage } from './ICatalogPage';
import { IProduct } from './IProduct';
import { IPurchasableOffer } from './IPurchasableOffer';
import { Offer } from './Offer';
import { Product } from './Product';

export class FurnitureOffer implements IPurchasableOffer
{
    private _furniData:IFurnitureData;
    private _page: ICatalogPage;
    private _product: IProduct;

    constructor(furniData: IFurnitureData)
    {
        this._furniData = furniData;
        this._product = (new Product(this._furniData.type, this._furniData.id, this._furniData.customParams, 1, GetProductDataForLocalization(this._furniData.className), this._furniData) as IProduct);
    }

    public activate(): void
    {
        SendMessageComposer(new GetProductOfferComposer((this._furniData.rentOfferId > -1) ? this._furniData.rentOfferId : this._furniData.purchaseOfferId));
    }

    public get offerId(): number
    {
        return (this.isRentOffer) ? this._furniData.rentOfferId : this._furniData.purchaseOfferId;
    }

    public get priceInActivityPoints(): number
    {
        return 0;
    }

    public get activityPointType(): number
    {
        return 0;
    }

    public get priceInCredits(): number
    {
        return 0;
    }

    public get page(): ICatalogPage
    {
        return this._page;
    }

    public set page(page: ICatalogPage)
    {
        this._page = page;
    }

    public get priceType(): string
    {
        return '';
    }

    public get product(): IProduct
    {
        return this._product;
    }

    public get products(): IProduct[]
    {
        return [ this._product ];
    }

    public get localizationId(): string
    {
        return 'roomItem.name.' + this._furniData.id;
    }

    public get bundlePurchaseAllowed(): boolean
    {
        return false;
    }

    public get isRentOffer(): boolean
    {
        return (this._furniData.rentOfferId > -1);
    }

    public get giftable(): boolean
    {
        return false;
    }

    public get pricingModel(): string
    {
        return Offer.PRICING_MODEL_FURNITURE;
    }

    public get clubLevel(): number
    {
        return 0;
    }

    public get badgeCode(): string
    {
        return '';
    }

    public get localizationName(): string
    {
        return this._furniData.name;
    }

    public get localizationDescription(): string
    {
        return this._furniData.description;
    }

    public get isLazy(): boolean
    {
        return true;
    }
}
