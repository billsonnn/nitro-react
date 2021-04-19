import { IMessageComposer, IMessageEvent } from 'nitro-renderer';
import { Nitro } from 'nitro-renderer/src/nitro/Nitro';
import { useEffect } from 'react';

export function CreateMessageHook(event: IMessageEvent): void
{
    useEffect(() =>
    {
        console.log('register', event);
        Nitro.instance.communication.registerMessageEvent(event);
        
        return () =>
        {
            console.log('unregister', event);
            Nitro.instance.communication.removeMessageEvent(event);
        }
    }, []);
}

export function SendMessageHook(event: IMessageComposer<unknown[]>): void
{
    Nitro.instance.communication.connection.send(event);
}
