import { GetRoomSessionManager } from '../nitro';

export function VisitRoom(roomId: number, password: string = null): void
{
    GetRoomSessionManager().createSession(roomId, password);
}
