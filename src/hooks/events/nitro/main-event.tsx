import { NitroEvent } from 'nitro-renderer';
import { Nitro } from 'nitro-renderer/src/nitro/Nitro';
import { CreateEventDispatcherHook, DispatchEventHook } from '../event-dispatcher.base';

export function useMainEvent(type: string, handler: (event: NitroEvent) => void): void
{
    CreateEventDispatcherHook(type, Nitro.instance.events, handler);
}

export function dispatchMainEvent(event: NitroEvent): void
{
    DispatchEventHook(Nitro.instance.events, event);
}
