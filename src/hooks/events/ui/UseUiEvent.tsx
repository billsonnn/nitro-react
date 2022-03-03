import { NitroEvent } from '@nitrots/nitro-renderer';
import { UseEventDispatcherHook } from '../UseEventDispatcherHook';
import { UI_EVENT_DISPATCHER } from './UiEventDispatcher';

export const UseUiEvent = (type: string, handler: (event: NitroEvent) => void) => UseEventDispatcherHook(type, UI_EVENT_DISPATCHER, handler);
