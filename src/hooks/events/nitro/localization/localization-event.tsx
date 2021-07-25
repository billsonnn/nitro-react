import { NitroEvent } from 'nitro-renderer';
import { GetNitroInstance } from '../../../../api';
import { CreateEventDispatcherHook } from '../../event-dispatcher.base';

export function useLocalizationEvent(type: string, handler: (event: NitroEvent) => void): void
{
    CreateEventDispatcherHook(type, GetNitroInstance().localization.events, handler);
}
