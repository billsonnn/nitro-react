import { RoomObjectCategory, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { GetRoomSession } from '.';
import { GetRoomEngine } from '..';
import { GetSessionDataManager } from '../../../api';

export function IsOwnerOfFloorFurniture(id: number): boolean
{
    const roomObject = GetRoomEngine().getRoomObject(GetRoomSession().roomId, id, RoomObjectCategory.FLOOR);

    if(!roomObject || !roomObject.model) return false;

    const userId = GetSessionDataManager().userId;
    const objectOwnerId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_OWNER_ID);

    return (userId === objectOwnerId);
}
