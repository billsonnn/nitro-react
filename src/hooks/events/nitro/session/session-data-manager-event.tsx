import { NitroEvent } from '@nitrots/nitro-renderer';
import { GetSessionDataManager } from '../../../../api';
import { CreateEventDispatcherHook } from '../../event-dispatcher.base';

export function useSessionDataManagerEvent(type: string, handler: (event: NitroEvent) => void): void
{
    CreateEventDispatcherHook(type, GetSessionDataManager().events, handler);
}
