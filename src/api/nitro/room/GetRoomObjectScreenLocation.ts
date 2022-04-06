import { GetRoomEngine } from './GetRoomEngine';

export const GetRoomObjectScreenLocation = (roomId: number, objectId: number, category: number, canvasId = 1) =>
{
    const point = GetRoomEngine().getRoomObjectScreenLocation(roomId, objectId, category, canvasId);

    if(!point) return null;

    if(window.devicePixelRatio !== 1)
    {
        point.x = Math.round(point.x / window.devicePixelRatio);
        point.y = Math.round(point.y / window.devicePixelRatio);
    }

    return point;
}
