import { IRoomSessionManager } from '@nitrots/nitro-renderer';
import { GetNitroInstance } from '../GetNitroInstance';

export function GetRoomSessionManager(): IRoomSessionManager
{
    return GetNitroInstance().roomSessionManager;
}
