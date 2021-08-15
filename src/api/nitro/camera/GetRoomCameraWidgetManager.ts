import { IRoomCameraWidgetManager } from '@nitrots/nitro-renderer';
import { GetNitroInstance } from '../GetNitroInstance';

export function GetRoomCameraWidgetManager(): IRoomCameraWidgetManager
{
    return GetNitroInstance().cameraManager;
}
