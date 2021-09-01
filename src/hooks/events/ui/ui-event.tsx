import { EventDispatcher, IEventDispatcher, NitroEvent } from '@nitrots/nitro-renderer';
import { CreateEventDispatcherHook, DispatchEventHook } from '../event-dispatcher.base';

const uiEventDispatcher: IEventDispatcher = new EventDispatcher();

export const useUiEvent = (type: string, handler: (event: NitroEvent) => void) =>
{
    return CreateEventDispatcherHook(type, uiEventDispatcher, handler);
}

export function dispatchUiEvent(event: NitroEvent): void
{
    DispatchEventHook(uiEventDispatcher, event);
}
