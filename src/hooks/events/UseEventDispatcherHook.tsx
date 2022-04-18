import { IEventDispatcher, NitroEvent } from '@nitrots/nitro-renderer';
import { useEffect } from 'react';

export const UseEventDispatcherHook = <T extends NitroEvent>(type: string, eventDispatcher: IEventDispatcher, handler: (event: T) => void) =>
{
    useEffect(() =>
    {
        eventDispatcher.addEventListener(type, handler);

        return () => eventDispatcher.removeEventListener(type, handler);
    }, [ type, eventDispatcher, handler ]);
}
