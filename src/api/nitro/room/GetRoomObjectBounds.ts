import { NitroRectangle } from '@nitrots/nitro-renderer';
import { GetRoomEngine } from './GetRoomEngine';

export function GetRoomObjectBounds(roomId: number, objectId: number, category: number, canvasId = 1): NitroRectangle
{
    return GetRoomEngine().getRoomObjectBoundingRectangle(roomId, objectId, category, canvasId);
}
