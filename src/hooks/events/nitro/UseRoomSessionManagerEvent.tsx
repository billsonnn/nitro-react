import { NitroEvent } from '@nitrots/nitro-renderer';
import { GetRoomSessionManager } from '../../../api';
import { UseEventDispatcherHook } from '../UseEventDispatcherHook';

export const UseRoomSessionManagerEvent = <T extends NitroEvent>(type: string, handler: (event: T) => void) => UseEventDispatcherHook(type, GetRoomSessionManager().events, handler);
