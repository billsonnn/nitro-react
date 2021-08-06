import { NitroEvent } from '@nitrots/nitro-renderer';
import { GetAvatarRenderManager } from '../../../../api';
import { CreateEventDispatcherHook } from '../../event-dispatcher.base';

export function useAvatarEvent(type: string, handler: (event: NitroEvent) => void): void
{
    CreateEventDispatcherHook(type, GetAvatarRenderManager().events, handler);
}
