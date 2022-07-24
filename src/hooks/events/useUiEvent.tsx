import { NitroEvent } from '@nitrots/nitro-renderer';
import { UI_EVENT_DISPATCHER } from '../../api';
import { useEventDispatcher } from './useEventDispatcher';

export const useUiEvent = <T extends NitroEvent>(type: string | string[], handler: (event: T) => void, enabled: boolean = true) => useEventDispatcher<T>(type, UI_EVENT_DISPATCHER, handler, enabled);
