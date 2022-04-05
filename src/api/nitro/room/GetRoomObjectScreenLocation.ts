import { GetRoomEngine } from './GetRoomEngine';

export const GetRoomObjectScreenLocation = (roomId: number, objectId: number, category: number, canvasId = 1) =>
{
    const point = GetRoomEngine().getRoomObjectScreenLocation(roomId, objectId, category, canvasId);

    if(!point) return null;

    if(window.devicePixelRatio !== 1)
    {
        point.x /= window.devicePixelRatio;
        point.y /= window.devicePixelRatio;
    }

    return point;
}
