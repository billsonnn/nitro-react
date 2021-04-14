import { Nitro, NitroEvent } from 'nitro-renderer';
import { CreateEventDispatcherHook } from '../../event-dispatcher.base';

export function useRoomSessionManagerEvent(type: string, handler: (event: NitroEvent) => void): void
{
    CreateEventDispatcherHook(type, Nitro.instance.roomSessionManager.events, handler);
}
