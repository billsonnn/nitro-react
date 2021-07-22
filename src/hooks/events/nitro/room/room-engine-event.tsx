import { NitroEvent } from 'nitro-renderer';
import { GetRoomEngine } from '../../../../api';
import { CreateEventDispatcherHook } from '../../event-dispatcher.base';

export function useRoomEngineEvent(type: string, handler: (event: NitroEvent) => void): void
{
    CreateEventDispatcherHook(type, GetRoomEngine().events, handler);
}
