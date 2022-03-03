import { NitroEvent } from '@nitrots/nitro-renderer';
import { GetRoomEngine } from '../../../api';
import { UseEventDispatcherHook } from '../UseEventDispatcherHook';

export const UseRoomEngineEvent = (type: string, handler: (event: NitroEvent) => void) => UseEventDispatcherHook(type, GetRoomEngine().events, handler);
