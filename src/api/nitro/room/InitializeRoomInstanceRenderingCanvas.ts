import { GetRoomEngine } from '@nitrots/nitro-renderer';

export const InitializeRoomInstanceRenderingCanvas = (width: number, height: number, canvasId: number = 1) =>
{
    const roomEngine = GetRoomEngine();
    const roomId = roomEngine.activeRoomId;

    roomEngine.initializeRoomInstanceRenderingCanvas(roomId, canvasId, width, height);
};
