import { IRoomCameraWidgetManager } from 'nitro-renderer/src/nitro/camera/IRoomCameraWidgetManager';
import { GetNitroInstance } from '../GetNitroInstance';

export function GetRoomCameraWidgetManager(): IRoomCameraWidgetManager
{
    return GetNitroInstance().cameraManager;
}
