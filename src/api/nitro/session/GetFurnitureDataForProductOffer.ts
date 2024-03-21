import { CatalogPageMessageProductData, FurnitureType, GetSessionDataManager, IFurnitureData } from '@nitrots/nitro-renderer';

export function GetFurnitureDataForProductOffer(offer: CatalogPageMessageProductData): IFurnitureData
{
    if(!offer) return null;

    let furniData: IFurnitureData = null;

    switch((offer.productType.toUpperCase()))
    {
        case FurnitureType.FLOOR:
            furniData = GetSessionDataManager().getFloorItemData(offer.furniClassId);
            break;
        case FurnitureType.WALL:
            furniData = GetSessionDataManager().getWallItemData(offer.furniClassId);
            break;
    }

    return furniData;
}
