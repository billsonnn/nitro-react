import { GetRoomEngine } from './GetRoomEngine';

export const GetRoomObjectScreenLocation = (roomId: number, objectId: number, category: number, canvasId = 1) =>
{
    const point = GetRoomEngine().getRoomObjectScreenLocation(roomId, objectId, category, canvasId);

    if(!point) return null;

    point.x = Math.round(point.x);
    point.y = Math.round(point.y);

    return point;
}
