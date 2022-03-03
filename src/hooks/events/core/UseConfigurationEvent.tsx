import { NitroEvent } from '@nitrots/nitro-renderer';
import { GetConfigurationManager } from '../../../api';
import { UseEventDispatcherHook } from '../UseEventDispatcherHook';

export const UseConfigurationEvent = (type: string, handler: (event: NitroEvent) => void) => UseEventDispatcherHook(type, GetConfigurationManager().events, handler);
