import { NitroEvent } from '@nitrots/nitro-renderer';
import { GetConfigurationManager } from '../../../../api';
import { CreateEventDispatcherHook } from '../../event-dispatcher.base';

export function useConfigurationEvent(type: string, handler: (event: NitroEvent) => void): void
{
    CreateEventDispatcherHook(type, GetConfigurationManager().events, handler);
}
