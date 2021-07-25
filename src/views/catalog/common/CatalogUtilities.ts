import { CatalogPageOfferData, ICatalogPageData, ICatalogPageParser, IFurnitureData, SellablePetPaletteData } from 'nitro-renderer';
import { GetConfiguration, GetProductDataForLocalization, GetRoomEngine } from '../../../api';

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

export function GetPetIndexFromLocalization(localization: string)
{
    if(!localization.length) return 0;

    let index = (localization.length - 1);

    while(index >= 0)
    {
        if(isNaN(parseInt(localization.charAt(index)))) break;

        index--;
    }

    if(index > 0) return parseInt(localization.substring(index + 1));

    return -1;
}

export function GetPetAvailableColors(petIndex: number, palettes: SellablePetPaletteData[]): number[][]
{
    switch(petIndex)
    {
        case 0:
            return [[16743226], [16750435], [16764339], [0xF59500], [16498012], [16704690], [0xEDD400], [16115545], [16513201], [8694111], [11585939], [14413767], [6664599], [9553845], [12971486], [8358322], [10002885], [13292268], [10780600], [12623573], [14403561], [12418717], [14327229], [15517403], [14515069], [15764368], [16366271], [0xABABAB], [0xD4D4D4], [0xFFFFFF], [14256481], [14656129], [15848130], [14005087], [14337152], [15918540], [15118118], [15531929], [9764857], [11258085]];
        case 1:
            return [[16743226], [16750435], [16764339], [0xF59500], [16498012], [16704690], [0xEDD400], [16115545], [16513201], [8694111], [11585939], [14413767], [6664599], [9553845], [12971486], [8358322], [10002885], [13292268], [10780600], [12623573], [14403561], [12418717], [14327229], [15517403], [14515069], [15764368], [16366271], [0xABABAB], [0xD4D4D4], [0xFFFFFF], [14256481], [14656129], [15848130], [14005087], [14337152], [15918540], [15118118], [15531929], [9764857], [11258085]];
        case 2:
            return [[16579283], [15378351], [8830016], [15257125], [9340985], [8949607], [6198292], [8703620], [9889626], [8972045], [12161285], [13162269], [8620113], [12616503], [8628101], [0xD2FF00], [9764857]];
        case 3:
            return [[0xFFFFFF], [0xEEEEEE], [0xDDDDDD]];
        case 4:
            return [[0xFFFFFF], [16053490], [15464440], [16248792], [15396319], [15007487]];
        case 5:
            return [[0xFFFFFF], [0xEEEEEE], [0xDDDDDD]];
        case 6:
            return [[0xFFFFFF], [0xEEEEEE], [0xDDDDDD], [16767177], [16770205], [16751331]];
        case 7:
            return [[0xCCCCCC], [0xAEAEAE], [16751331], [10149119], [16763290], [16743786]];
        default: {
            const colors: number[][] = [];

            for(const palette of palettes)
            {
                const petColorResult = GetRoomEngine().getPetColorResult(petIndex, palette.paletteId);

                if(!petColorResult) continue;

                if(petColorResult.primaryColor === petColorResult.secondaryColor)
                {
                    colors.push([ petColorResult.primaryColor ]);
                }
                else
                {
                    colors.push([ petColorResult.primaryColor, petColorResult.secondaryColor ]);
                }
            }

            return colors;
        }
    }
}

export function GetCatalogPageTree(page: ICatalogPageData, targetPageId: number, tree: ICatalogPageData[])
{
    if(page.pageId === targetPageId) return page;

    for(const pageData of page.children)
    {
        const foundPageData = GetCatalogPageTree(pageData, targetPageId, tree);

        if(foundPageData)
        {
            tree.push(pageData);

            return pageData;
        }
    }
}
