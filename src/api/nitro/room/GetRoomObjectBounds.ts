import { GetRoomEngine } from './GetRoomEngine';

export const GetRoomObjectBounds = (roomId: number, objectId: number, category: number, canvasId = 1) =>
{
    const rectangle = GetRoomEngine().getRoomObjectBoundingRectangle(roomId, objectId, category, canvasId);

    if(!rectangle) return null;

    if(window.devicePixelRatio !== 1)
    {
        rectangle.x = Math.round(rectangle.x / window.devicePixelRatio);
        rectangle.y = Math.round(rectangle.y / window.devicePixelRatio);
    }

    return rectangle;
}
