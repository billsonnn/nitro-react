import { GetRoomEngine } from '@nitrots/nitro-renderer';

export function SetActiveRoomId(roomId: number): void
{
    GetRoomEngine().setActiveRoomId(roomId);
}
