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
        console.log('register', type);

        eventDispatcher.addEventListener(type, handlerRef.current);

        return () =>
        {
            console.log('unregister', type);

            eventDispatcher.removeEventListener(type, handlerRef.current);
        }
    }, [ type, eventDispatcher, handler ]);
}

export function DispatchEventHook(eventDispatcher: IEventDispatcher, event: NitroEvent): void
{
    eventDispatcher.dispatchEvent(event);
}
