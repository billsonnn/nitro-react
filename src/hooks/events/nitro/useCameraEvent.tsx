import { NitroEvent } from '@nitrots/nitro-renderer';
import { GetNitroInstance } from '../../../api';
import { useEventDispatcher } from '../useEventDispatcher';

export const useCameraEvent = <T extends NitroEvent>(type: string | string[], handler: (event: T) => void) => useEventDispatcher(type, GetNitroInstance().cameraManager.events, handler);
