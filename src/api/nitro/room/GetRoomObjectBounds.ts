import { GetRoomEngine } from '@nitrots/nitro-renderer';

export const GetRoomObjectBounds = (roomId: number, objectId: number, category: number, canvasId = 1) =>
{
    const rectangle = GetRoomEngine().getRoomObjectBoundingRectangle(roomId, objectId, category, canvasId);

    if(!rectangle) return null;

    rectangle.x = Math.round(rectangle.x);
    rectangle.y = Math.round(rectangle.y);

    return rectangle;
};
