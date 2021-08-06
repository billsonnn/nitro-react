import { CatalogProductOfferData, FurnitureType, IFurnitureData } from '@nitrots/nitro-renderer';
import { GetSessionDataManager } from './GetSessionDataManager';

export function GetFurnitureDataForProductOffer(offer: CatalogProductOfferData): IFurnitureData
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
