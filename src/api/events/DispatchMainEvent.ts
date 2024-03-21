import { GetEventDispatcher, NitroEvent } from '@nitrots/nitro-renderer';
import { DispatchEvent } from './DispatchEvent';

export const DispatchMainEvent = (event: NitroEvent) => DispatchEvent(GetEventDispatcher(), event);
