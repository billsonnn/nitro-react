import { IRoomSession } from 'nitro-renderer';
import { GetRoomSessionManager } from './GetRoomSessionManager';

export function StartRoomSession(session: IRoomSession): void
{
    GetRoomSessionManager().startSession(session);
}
