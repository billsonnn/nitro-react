import { IRoomObjectController, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { GetRoomSession, GetSessionDataManager } from '../session';
import { GetRoomEngine } from './GetRoomEngine';

export function GetOwnRoomObject(): IRoomObjectController
{
    const userId = GetSessionDataManager().userId;
    const roomId = GetRoomEngine().activeRoomId;
    const category = RoomObjectCategory.UNIT;
    const totalObjects = GetRoomEngine().getTotalObjectsForManager(roomId, category);

    let i = 0;

    while(i < totalObjects)
    {
        const roomObject = GetRoomEngine().getRoomObjectByIndex(roomId, i, category);

        if(roomObject)
        {
            const userData = GetRoomSession().userDataManager.getUserDataByIndex(roomObject.id);

            if(userData)
            {
                if(userData.webID === userId) return roomObject;
            }
        }

        i++;
    }

    return null;
}
