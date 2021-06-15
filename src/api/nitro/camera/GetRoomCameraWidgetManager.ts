import { Nitro } from 'nitro-renderer';
import { IRoomCameraWidgetManager } from 'nitro-renderer/src/nitro/camera/IRoomCameraWidgetManager';

export function GetRoomCameraWidgetManager(): IRoomCameraWidgetManager
{
    return Nitro.instance.cameraManager;
}
