import { GetRoomEngine, GetSessionDataManager, IRoomSession, RoomControllerLevel } from '@nitrots/nitro-renderer';
import { IsOwnerOfFurniture } from './IsOwnerOfFurniture';

export function CanManipulateFurniture(roomSession: IRoomSession, objectId: number, category: number): boolean
{
    if(!roomSession) return false;

    return (roomSession.isRoomOwner || (roomSession.controllerLevel >= RoomControllerLevel.GUEST) || GetSessionDataManager().isModerator || IsOwnerOfFurniture(GetRoomEngine().getRoomObject(roomSession.roomId, objectId, category)));
}
