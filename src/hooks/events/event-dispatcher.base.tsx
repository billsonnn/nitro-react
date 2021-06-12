import { IEventDispatcher, NitroEvent } from 'nitro-renderer';
import { useEffect } from 'react';

export function CreateEventDispatcherHook(type: string, eventDispatcher: IEventDispatcher, handler: (event: NitroEvent) => void): void
{
    useEffect(() =>
    {
        eventDispatcher.addEventListener(type, handler);

        return () =>
        {
            eventDispatcher.removeEventListener(type, handler);
        }
    }, [ type, eventDispatcher, handler ]);
}

export function DispatchEventHook(eventDispatcher: IEventDispatcher, event: NitroEvent): void
{
    eventDispatcher.dispatchEvent(event);
}
