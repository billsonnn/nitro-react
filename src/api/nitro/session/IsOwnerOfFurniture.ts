import { GetSessionDataManager, IRoomObject, RoomObjectVariable } from '@nitrots/nitro-renderer';

export function IsOwnerOfFurniture(roomObject: IRoomObject): boolean
{
    if(!roomObject || !roomObject.model) return false;

    const userId = GetSessionDataManager().userId;
    const objectOwnerId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_OWNER_ID);

    return (userId === objectOwnerId);
}
