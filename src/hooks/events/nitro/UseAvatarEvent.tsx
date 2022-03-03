import { NitroEvent } from '@nitrots/nitro-renderer';
import { GetAvatarRenderManager } from '../../../api';
import { UseEventDispatcherHook } from '../UseEventDispatcherHook';

export const UseAvatarEvent = (type: string, handler: (event: NitroEvent) => void) => UseEventDispatcherHook(type, GetAvatarRenderManager().events, handler);
