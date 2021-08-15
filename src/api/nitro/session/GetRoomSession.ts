import { IRoomSession } from '@nitrots/nitro-renderer';
import { GetRoomSessionManager } from './GetRoomSessionManager';

export function GetRoomSession(): IRoomSession
{
    return GetRoomSessionManager().getSession(-1);
}
