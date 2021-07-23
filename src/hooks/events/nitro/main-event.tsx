import { NitroEvent } from 'nitro-renderer';
import { GetNitroInstance } from '../../../api';
import { CreateEventDispatcherHook, DispatchEventHook } from '../event-dispatcher.base';

export function useMainEvent(type: string, handler: (event: NitroEvent) => void): void
{
    CreateEventDispatcherHook(type, GetNitroInstance().events, handler);
}

export function dispatchMainEvent(event: NitroEvent): void
{
    DispatchEventHook(GetNitroInstance().events, event);
}
