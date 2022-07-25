import { IEventDispatcher, NitroEvent } from '@nitrots/nitro-renderer';
import { useEffect } from 'react';

export const useEventDispatcher = <T extends NitroEvent>(type: string | string[], eventDispatcher: IEventDispatcher, handler: (event: T) => void, enabled: boolean = true) =>
{
    useEffect(() =>
    {
        if(!enabled) return;

        if(Array.isArray(type))
        {
            type.map(name => eventDispatcher.addEventListener(name, handler));
        }
        else
        {
            eventDispatcher.addEventListener(type, handler);
        }

        return () =>
        {
            if(Array.isArray(type))
            {
                type.map(name => eventDispatcher.removeEventListener(name, handler));
            }
            else
            {
                eventDispatcher.removeEventListener(type, handler);
            }
        }
    }, [ type, eventDispatcher, enabled, handler ]);
}
