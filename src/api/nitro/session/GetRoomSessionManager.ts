import { IRoomSessionManager } from 'nitro-renderer';
import { GetNitroInstance } from '../GetNitroInstance';

export function GetRoomSessionManager(): IRoomSessionManager
{
    return GetNitroInstance().roomSessionManager;
}
