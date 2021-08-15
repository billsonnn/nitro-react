import { RoomInfoComposer } from '@nitrots/nitro-renderer';
import { SendMessageHook } from '../../hooks/messages/message-event';

export function TryVisitRoom(roomId: number): void
{
    SendMessageHook(new RoomInfoComposer(roomId, false, true));
}
