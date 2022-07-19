import { NitroEvent } from '@nitrots/nitro-renderer';
import { GetCommunication } from '../../../api';
import { useEventDispatcher } from '../useEventDispatcher';

export const useCommunicationEvent = <T extends NitroEvent>(type: string | string[], handler: (event: T) => void) => useEventDispatcher(type, GetCommunication().events, handler);
