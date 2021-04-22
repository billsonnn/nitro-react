import { IEventDispatcher, NitroEvent } from 'nitro-renderer';
import { useEffect, useRef } from 'react';

export function CreateEventDispatcherHook(type: string, eventDispatcher: IEventDispatcher, handler: (event: NitroEvent) => void): void
{
    const handlerRef = useRef<(event: NitroEvent) => void>();

    useEffect(() =>
    {
        handlerRef.current = handler;
    }, [ handler ]);

    useEffect(() =>
    {
        eventDispatcher.addEventListener(type, handlerRef.current);

        return () =>
        {
            eventDispatcher.removeEventListener(type, handlerRef.current);
        }
    }, [ type, eventDispatcher ]);
}

export function DispatchEventHook(eventDispatcher: IEventDispatcher, event: NitroEvent): void
{
    eventDispatcher.dispatchEvent(event);
}
