import { NitroEvent } from 'nitro-renderer';
import { Nitro } from 'nitro-renderer/src/nitro/Nitro';
import { CreateEventDispatcherHook } from '../../event-dispatcher.base';

export function useCommunicationEvent(type: string, handler: (event: NitroEvent) => void): void
{
    CreateEventDispatcherHook(type, Nitro.instance.communication.events, handler);
}
