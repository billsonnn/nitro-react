import { IMessageComposer, IMessageEvent, MessageEvent } from 'nitro-renderer';
import { Nitro } from 'nitro-renderer/src/nitro/Nitro';
import { useEffect } from 'react';

export function CreateMessageHook(eventType: typeof MessageEvent, handler: (event: IMessageEvent) => void): void
{
    useEffect(() =>
    {
        //@ts-ignore
        const event = new eventType(handler);
        
        Nitro.instance.communication.registerMessageEvent(event);
        
        return () => Nitro.instance.communication.removeMessageEvent(event);
    }, [ eventType, handler ]);
}

export function SendMessageHook(event: IMessageComposer<unknown[]>): void
{
    Nitro.instance.communication.connection.send(event);
}
