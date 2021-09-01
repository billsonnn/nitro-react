import { IEventDispatcher, NitroEvent } from '@nitrots/nitro-renderer';
import { useEffect } from 'react';

export const CreateEventDispatcherHook = (type: string, eventDispatcher: IEventDispatcher, handler: (event: NitroEvent) => void) =>
{
    return useEffect(() =>
    {
        eventDispatcher.addEventListener(type, handler);

        return () =>
        {
            eventDispatcher.removeEventListener(type, handler);
        }
    }, [ type, eventDispatcher, handler ]);
}

export const DispatchEventHook = (eventDispatcher: IEventDispatcher, event: NitroEvent) =>
{
    eventDispatcher.dispatchEvent(event);
}
