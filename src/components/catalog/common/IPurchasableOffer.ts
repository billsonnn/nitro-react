import { ICatalogPage } from './ICatalogPage';
import { IProduct } from './IProduct';

export interface IPurchasableOffer
{
    clubLevel: number;
    page: ICatalogPage;
    offerId: number;
    localizationId: string;
    priceInCredits: number;
    priceInActivityPoints: number;
    activityPointType: number;
    giftable: boolean;
    product: IProduct;
    pricingModel: string;
    priceType: string;
    bundlePurchaseAllowed: boolean;
    isRentOffer: boolean;
    badgeCode: string;
    localizationName: string;
    localizationDescription: string;
    products: IProduct[];
}
