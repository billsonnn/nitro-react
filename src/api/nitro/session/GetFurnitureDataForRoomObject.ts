import { GetRoomEngine, GetSessionDataManager, IFurnitureData, RoomObjectCategory, RoomObjectVariable } from '@nitrots/nitro-renderer';

export function GetFurnitureDataForRoomObject(roomId: number, objectId: number, category: number): IFurnitureData
{
    const roomObject = GetRoomEngine().getRoomObject(roomId, objectId, category);

    if(!roomObject) return;

    const typeId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_TYPE_ID);

    switch(category)
    {
        case RoomObjectCategory.FLOOR:
            return GetSessionDataManager().getFloorItemData(typeId);
        case RoomObjectCategory.WALL:
            return GetSessionDataManager().getWallItemData(typeId);
    }

    return null;
}
