import { NitroEvent } from '@nitrots/nitro-renderer';
import { GetCommunication } from '../../../api';
import { UseEventDispatcherHook } from '../UseEventDispatcherHook';

export const UseCommunicationEvent = (type: string, handler: (event: NitroEvent) => void) => UseEventDispatcherHook(type, GetCommunication().events, handler);
