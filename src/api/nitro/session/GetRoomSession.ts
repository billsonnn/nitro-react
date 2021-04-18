import { IRoomSession } from 'nitro-renderer';
import { GetRoomSessionManager } from './GetRoomSessionManager';

export function GetRoomSession(roomId: number): IRoomSession
{
    return GetRoomSessionManager().getSession(roomId);
}
