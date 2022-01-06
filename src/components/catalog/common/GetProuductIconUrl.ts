import { FurnitureType } from '@nitrots/nitro-renderer';
import { GetConfiguration, GetRoomEngine, GetSessionDataManager } from '../../../api';

export const GetProductIconUrl = (furniClassId: number, productType: string, customParams: string = null) =>
{
    switch(productType.toUpperCase())
    {
        case FurnitureType.BADGE:
            return GetSessionDataManager().getBadgeUrl(customParams);
        case FurnitureType.ROBOT:
            return undefined;
        case FurnitureType.FLOOR:
            return GetRoomEngine().getFurnitureFloorIconUrl(furniClassId);
        case FurnitureType.WALL: {
            const furniData = GetSessionDataManager().getWallItemData(furniClassId);
            
            let iconName = '';

            if(furniData)
            {
                switch(furniData.className)
                {
                    case 'floor':
                        iconName = [ 'th', furniData.className, customParams ].join('_');
                        break;
                    case 'wallpaper':
                        iconName = [ 'th', 'wall', customParams ].join('_');
                        break;
                    case 'landscape':
                        iconName = [ 'th', furniData.className, customParams.replace('.', '_'), '001' ].join('_');
                        break;
                }

                if(iconName !== '')
                {
                    const assetUrl = GetConfiguration<string>('catalog.asset.url');

                    return `${ assetUrl }/${ iconName }.png`;
                }
            }

            return GetRoomEngine().getFurnitureWallIconUrl(furniClassId, customParams);
        }
    }

    return null;
}
