import { IFurnitureData, RoomObjectCategory, RoomObjectVariable } from 'nitro-renderer';
import { GetRoomEngine } from '../room';
import { GetRoomSession } from './GetRoomSession';
import { GetSessionDataManager } from './GetSessionDataManager';
import { RoomObjectNameData } from './RoomObjectNameData';

export function GetObjectName(roomId: number, objectId: number, category: number): RoomObjectNameData
{
    let id = -1;
    let name: string = null;
    let type = 0;

    switch(category)
    {
        case RoomObjectCategory.FLOOR:
        case RoomObjectCategory.WALL:
            const roomObject = GetRoomEngine().getRoomObject(roomId, objectId, category);

            if(!roomObject) return;

            if(roomObject.type.indexOf('poster') === 0)
            {
                name = ('${poster_' + parseInt(roomObject.type.replace('poster', '')) + '_name}');
            }
            else
            {
                let furniData: IFurnitureData = null;

                const typeId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_TYPE_ID);

                if(category === RoomObjectCategory.FLOOR)
                {
                    furniData = GetSessionDataManager().getFloorItemData(typeId);
                }

                else if(category === RoomObjectCategory.WALL)
                {
                    furniData = GetSessionDataManager().getWallItemData(typeId);
                }

                if(!furniData) return;

                id = furniData.id;
                name = furniData.name;
            }
            break;
        case RoomObjectCategory.UNIT:
            const userData = GetRoomSession().userDataManager.getUserDataByIndex(objectId);

            if(!userData) return;

            id = userData.webID;
            name = userData.name;
            type = userData.type;
            break;
    }

    if(!name) return null;

    return new RoomObjectNameData(objectId, category, id, name, type);
}
