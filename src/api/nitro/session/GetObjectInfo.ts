import { RoomObjectCategory, RoomObjectType } from 'nitro-renderer';
import { FurnitureInfoData } from './FurnitureInfoData';
import { GetBotInfoData } from './GetBotInfoData';
import { GetFurnitureInfoData } from './GetFurnitureInfoData';
import { GetRentableBotInfoData } from './GetRentableBotInfoData';
import { GetRoomSession } from './GetRoomSession';
import { GetUserInfoData } from './GetUserInfoData';
import { RentableBotInfoData } from './RentableBotInfoData';
import { UserInfoData } from './UserInfoData';

export function GetObjectInfo(roomId: number, objectId: number, category: number): FurnitureInfoData | UserInfoData | RentableBotInfoData
{
    switch(category)
    {
        case RoomObjectCategory.FLOOR:
        case RoomObjectCategory.WALL:
            return GetFurnitureInfoData(roomId, objectId, category);
        case RoomObjectCategory.UNIT:
            const userData = GetRoomSession().userDataManager.getUserDataByIndex(objectId);

            if(!userData) return null;

            switch(userData.type)
            {
                case RoomObjectType.PET:
                    GetRoomSession().userDataManager.requestPetInfo(userData.webID);
                    return null;
                case RoomObjectType.USER:
                    return GetUserInfoData(roomId, objectId, category, userData);
                case RoomObjectType.BOT:
                    return GetBotInfoData(roomId, objectId, category, userData);
                case RoomObjectType.RENTABLE_BOT:
                    return GetRentableBotInfoData(roomId, objectId, category, userData);
            }
    }

    return null;
}
