import { NitroEvent } from 'nitro-renderer';
import { Nitro } from 'nitro-renderer/src/nitro/Nitro';
import { CreateEventDispatcherHook } from '../../event-dispatcher.base';

export function useLocalizationEvent(type: string, handler: (event: NitroEvent) => void): void
{
    CreateEventDispatcherHook(type, Nitro.instance.localization.events, handler);
}
