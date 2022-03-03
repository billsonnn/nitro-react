import { NitroEvent } from '@nitrots/nitro-renderer';
import { GetNitroInstance } from '../../../api';
import { DispatchEventHook } from '../DispatchEventHook';

export const DispatchMainEvent = (event: NitroEvent) => DispatchEventHook(GetNitroInstance().events, event);
