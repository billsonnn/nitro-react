import { NitroEvent } from '@nitrots/nitro-renderer';
import { GetRoomEngine } from '../../../api';
import { UseEventDispatcherHook } from '../UseEventDispatcherHook';

export const UseRoomEngineEvent = <T extends NitroEvent>(type: string, handler: (event: T) => void) => UseEventDispatcherHook(type, GetRoomEngine().events, handler);
