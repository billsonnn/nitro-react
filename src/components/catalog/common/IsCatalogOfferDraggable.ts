import { CatalogPageMessageOfferData, RoomControllerLevel } from '@nitrots/nitro-renderer';
import { GetRoomSession } from '../../../api';
import { ProductTypeEnum } from './ProductTypeEnum';

export const IsCatalogOfferDraggable = (offer: CatalogPageMessageOfferData) =>
{
    return ((GetRoomSession().isRoomOwner || (GetRoomSession().isGuildRoom && (GetRoomSession().controllerLevel >= RoomControllerLevel.GUILD_MEMBER))) && (offer.products.length === 1) && (offer.products[0].productType !== ProductTypeEnum.EFFECT) && (offer.products[0].productType !== ProductTypeEnum.HABBO_CLUB))
}
