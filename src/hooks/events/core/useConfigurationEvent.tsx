import { NitroEvent } from '@nitrots/nitro-renderer';
import { GetConfigurationManager } from '../../../api';
import { useEventDispatcher } from '../useEventDispatcher';

export const useConfigurationEvent = <T extends NitroEvent>(type: string | string[], handler: (event: T) => void) => useEventDispatcher(type, GetConfigurationManager().events, handler);
