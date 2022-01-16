import { IFurnitureData } from '@nitrots/nitro-renderer';
import { GetSessionDataManager } from '.';
import { ProductTypeEnum } from '../../../components/catalog/common/ProductTypeEnum';

export function GetFurnitureData(furniClassId: number, productType: string): IFurnitureData
{
    let furniData: IFurnitureData = null;

    switch(productType.toLowerCase())
    {
        case ProductTypeEnum.FLOOR:
            furniData = GetSessionDataManager().getFloorItemData(furniClassId);
            break;
        case ProductTypeEnum.WALL:
            furniData = GetSessionDataManager().getWallItemData(furniClassId);
            break;
    }

    return furniData;
}
