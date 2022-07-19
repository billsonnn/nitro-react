import { NitroEvent } from '@nitrots/nitro-renderer';
import { GetRoomEngine } from '../../../api';
import { useEventDispatcher } from '../useEventDispatcher';

export const useRoomEngineEvent = <T extends NitroEvent>(type: string | string[], handler: (event: T) => void) => useEventDispatcher(type, GetRoomEngine().events, handler);
