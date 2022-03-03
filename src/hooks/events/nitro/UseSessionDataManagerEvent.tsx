import { NitroEvent } from '@nitrots/nitro-renderer';
import { GetSessionDataManager } from '../../../api';
import { UseEventDispatcherHook } from '../UseEventDispatcherHook';

export const UseSessionDataManagerEvent = (type: string, handler: (event: NitroEvent) => void) => UseEventDispatcherHook(type, GetSessionDataManager().events, handler);
