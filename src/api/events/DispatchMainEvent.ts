import { NitroEvent } from '@nitrots/nitro-renderer';
import { GetNitroInstance } from '../nitro';
import { DispatchEvent } from './DispatchEvent';

export const DispatchMainEvent = (event: NitroEvent) => DispatchEvent(GetNitroInstance().events, event);
