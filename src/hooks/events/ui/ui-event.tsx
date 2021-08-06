import { EventDispatcher, IEventDispatcher, NitroEvent } from '@nitrots/nitro-renderer';
import { CreateEventDispatcherHook, DispatchEventHook } from '../event-dispatcher.base';

const uiEventDispatcher: IEventDispatcher = new EventDispatcher();

export function useUiEvent(type: string, handler: (event: NitroEvent) => void): void
{
    CreateEventDispatcherHook(type, uiEventDispatcher, handler);
}

export function dispatchUiEvent(event: NitroEvent): void
{
    DispatchEventHook(uiEventDispatcher, event);
}
