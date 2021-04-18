import { IRoomSession, RoomControllerLevel } from 'nitro-renderer';
import { GetSessionDataManager } from '../../../api';
import { GetRoomEngine } from '../../../api/nitro/room/GetRoomEngine';
import { IsOwnerOfFurniture } from './IsOwnerOfFurniture';

export function CanManipulateFurniture(roomSession: IRoomSession, objectId: number, category: number): boolean
{
    if(!roomSession) return false;

    return ((roomSession.controllerLevel >= RoomControllerLevel.GUEST) || GetSessionDataManager().isModerator || IsOwnerOfFurniture(GetRoomEngine().getRoomObject(roomSession.roomId, objectId, category)));
}
