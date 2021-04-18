import { GetRoomEngine } from './GetRoomEngine';

export function SetActiveRoomId(roomId: number): void
{
    GetRoomEngine().setActiveRoomId(roomId);
}
