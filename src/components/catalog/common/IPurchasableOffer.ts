import { ICatalogPage } from './ICatalogPage';
import { IProduct } from './IProduct';

export interface IPurchasableOffer
{
    readonly clubLevel: number;
    page: ICatalogPage;
    readonly offerId: number;
    readonly localizationId: string;
    readonly priceInCredits: number;
    readonly priceInActivityPoints: number;
    readonly activityPointType: number;
    readonly giftable: boolean;
    readonly product: IProduct;
    readonly pricingModel: string;
    readonly priceType: string;
    readonly bundlePurchaseAllowed: boolean;
    readonly isRentOffer: boolean;
    readonly badgeCode: string;
    readonly localizationName: string;
    readonly localizationDescription: string;
}
