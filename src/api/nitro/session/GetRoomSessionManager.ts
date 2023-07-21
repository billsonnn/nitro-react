import { IRoomSessionManager } from '@nitrots/nitro-renderer';
import { GetRoomEngine } from '../room';

export function GetRoomSessionManager(): IRoomSessionManager
{
    return GetRoomEngine().roomSessionManager;
}
