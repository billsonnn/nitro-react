import { GetRoomSessionManager } from './GetRoomSessionManager';

export function CreateRoomSession(roomId: number, password: string = null): void
{
    GetRoomSessionManager().createSession(roomId, password);
}
