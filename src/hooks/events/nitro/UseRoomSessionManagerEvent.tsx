import { NitroEvent } from '@nitrots/nitro-renderer';
import { GetRoomSessionManager } from '../../../api';
import { UseEventDispatcherHook } from '../UseEventDispatcherHook';

export const UseRoomSessionManagerEvent = (type: string, handler: (event: NitroEvent) => void) => UseEventDispatcherHook(type, GetRoomSessionManager().events, handler);
