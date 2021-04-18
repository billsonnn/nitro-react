import { GetRoomEngine } from './GetRoomEngine';

export function InitializeRoomInstanceRenderingCanvas(roomId: number, canvasId: number, width: number, height: number): void
{
    GetRoomEngine().initializeRoomInstanceRenderingCanvas(roomId, canvasId, width, height);
}
