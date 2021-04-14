import { NitroEvent } from 'nitro-renderer';
import { Nitro } from 'nitro-renderer/src/nitro/Nitro';
import { CreateEventDispatcherHook } from '../../event-dispatcher.base';

export function useAvatarEvent(type: string, handler: (event: NitroEvent) => void): void
{
    CreateEventDispatcherHook(type, Nitro.instance.avatar.events, handler);
}
