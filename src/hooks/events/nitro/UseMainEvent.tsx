import { NitroEvent } from '@nitrots/nitro-renderer';
import { GetNitroInstance } from '../../../api';
import { UseEventDispatcherHook } from '../UseEventDispatcherHook';

export const UseMainEvent = (type: string, handler: (event: NitroEvent) => void) => UseEventDispatcherHook(type, GetNitroInstance().events, handler);
