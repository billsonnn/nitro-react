import { NitroEvent } from 'nitro-renderer';
import { GetRoomSessionManager } from '../../../../api';
import { CreateEventDispatcherHook } from '../../event-dispatcher.base';

export function useRoomSessionManagerEvent(type: string, handler: (event: NitroEvent) => void): void
{
    CreateEventDispatcherHook(type, GetRoomSessionManager().events, handler);
}
