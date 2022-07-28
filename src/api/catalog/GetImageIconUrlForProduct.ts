import { GetRoomEngine } from '../nitro';
import { ProductTypeEnum } from './ProductTypeEnum';

export const GetImageIconUrlForProduct = (productType: string, productClassId: number, extraData: string = null) =>
{
    let imageUrl: string = null;

    switch(productType.toLocaleLowerCase())
    {
        case ProductTypeEnum.FLOOR:
            imageUrl = GetRoomEngine().getFurnitureFloorIconUrl(productClassId);
            break;
        case ProductTypeEnum.WALL:
            imageUrl = GetRoomEngine().getFurnitureWallIconUrl(productClassId, extraData);
            break;
    }

    return imageUrl;
}
