import { NitroEvent } from '@nitrots/nitro-renderer';
import { DispatchEventHook } from '../DispatchEventHook';
import { UI_EVENT_DISPATCHER } from './UiEventDispatcher';

export const DispatchUiEvent = (event: NitroEvent) => DispatchEventHook(UI_EVENT_DISPATCHER, event);
