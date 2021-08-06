import { NitroEvent } from '@nitrots/nitro-renderer';
import { GetCommunication } from '../../../../api';
import { CreateEventDispatcherHook } from '../../event-dispatcher.base';

export function useCommunicationEvent(type: string, handler: (event: NitroEvent) => void): void
{
    CreateEventDispatcherHook(type, GetCommunication().events, handler);
}
