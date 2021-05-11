import { CatalogPageOfferData, ICatalogPageData, ICatalogPageParser, IFurnitureData } from 'nitro-renderer';
import { GetProductDataForLocalization } from '../../../api/nitro/session/GetProductDataForLocalization';
import { GetConfiguration } from '../../../utils/GetConfiguration';

export interface ICatalogOffers
{
    [key: string]: ICatalogPageData[];
}

export interface ICatalogSearchResult
{
    page: ICatalogPageData;
    furniture: IFurnitureData[];
}

export function GetOfferName(offer: CatalogPageOfferData): string
{
    const productData = GetProductDataForLocalization(offer.localizationId);

    if(productData) return productData.name;

    return offer.localizationId;
}

export function GetOfferNodes(offers: ICatalogOffers, offerId: number): ICatalogPageData[]
{
    const pages = offers[offerId.toString()];
    const allowedPages: ICatalogPageData[] = [];

    if(pages && pages.length)
    {
        for(const page of pages)
        {
            if(!page.visible) continue;
    
            allowedPages.push(page);
        }
    }

    return allowedPages;
}

export function SetOffersToNodes(offers: ICatalogOffers, pageData: ICatalogPageData): void
{
    if(pageData.offerIds && pageData.offerIds.length)
    {
        for(const offerId of pageData.offerIds)
        {
            let existing = offers[offerId.toString()];

            if(!existing)
            {
                existing = [];

                offers[offerId.toString()] = existing;
            }

            if(existing.indexOf(pageData) >= 0) continue;

            existing.push(pageData);
        }
    }

    if(pageData.children && pageData.children.length)
    {
        for(const child of pageData.children) SetOffersToNodes(offers, child);
    }
}

export function GetCatalogPageImage(page: ICatalogPageParser, index: number = 0): string
{
    const imageName = page.localization.images && page.localization.images[index];

    if(!imageName || !imageName.length) return null;

    let assetUrl = GetConfiguration<string>('catalog.asset.image.url');

    assetUrl = assetUrl.replace('%name%', imageName);

    return assetUrl;
}

export function GetCatalogPageText(page: ICatalogPageParser, index: number = 0): string
{
    let message = (page.localization.texts[index] || '');

    if(message && message.length) message = message.replace(/\r\n|\r|\n/g, '<br />');

    return (message || '');
}
