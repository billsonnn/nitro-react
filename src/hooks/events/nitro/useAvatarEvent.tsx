import { NitroEvent } from '@nitrots/nitro-renderer';
import { GetAvatarRenderManager } from '../../../api';
import { useEventDispatcher } from '../useEventDispatcher';

export const useAvatarEvent = <T extends NitroEvent>(type: string | string[], handler: (event: T) => void) => useEventDispatcher(type, GetAvatarRenderManager().events, handler);
