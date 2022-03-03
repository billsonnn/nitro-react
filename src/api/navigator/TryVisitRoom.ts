import { RoomInfoComposer } from '@nitrots/nitro-renderer';
import { SendMessageComposer } from '../nitro';

export function TryVisitRoom(roomId: number): void
{
    SendMessageComposer(new RoomInfoComposer(roomId, false, true));
}
