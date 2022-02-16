import { CatalogPageMessageOfferData, RoomObjectCategory, RoomObjectPlacementSource } from '@nitrots/nitro-renderer';
import { GetRoomEngine } from '../../../api';
import { IsCatalogOfferDraggable } from './IsCatalogOfferDraggable';
import { ProductTypeEnum } from './ProductTypeEnum';

export const AttemptCatalogPlacement = (offer: CatalogPageMessageOfferData) =>
{
    if(!IsCatalogOfferDraggable(offer)) return;

    const product = offer.products[0];

    let category: number = -1;

    switch(product.productType)
    {
        case ProductTypeEnum.FLOOR:
            category = RoomObjectCategory.FLOOR;
            break;
        case ProductTypeEnum.WALL:
            category = RoomObjectCategory.WALL;
            break;
    }

    if(category === -1) return;

    if(GetRoomEngine().processRoomObjectPlacement(RoomObjectPlacementSource.CATALOG, -(offer.offerId), category, product.furniClassId, (product.extraParam) ? product.extraParam.toString() : null))
    {
        
    }
}
