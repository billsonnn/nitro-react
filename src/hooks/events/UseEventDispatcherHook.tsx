import { IEventDispatcher, NitroEvent } from '@nitrots/nitro-renderer';
import { useEffect } from 'react';

export const UseEventDispatcherHook = (type: string, eventDispatcher: IEventDispatcher, handler: (event: NitroEvent) => void) =>
{
    useEffect(() =>
    {
        eventDispatcher.addEventListener(type, handler);

        return () => eventDispatcher.removeEventListener(type, handler);
    }, [ type, eventDispatcher, handler ]);
}
