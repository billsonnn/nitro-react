import { IMessageComposer, IMessageEvent, MessageEvent } from '@nitrots/nitro-renderer';
import { useEffect } from 'react';
import { GetCommunication, GetConnection } from '../../api';

export function CreateMessageHook(eventType: typeof MessageEvent, handler: (event: IMessageEvent) => void): void
{
    useEffect(() =>
    {
        //@ts-ignore
        const event = new eventType(handler);
        
        GetCommunication().registerMessageEvent(event);
        
        return () => GetCommunication().removeMessageEvent(event);
    }, [ eventType, handler ]);
}

export function SendMessageHook(event: IMessageComposer<unknown[]>): void
{
    GetConnection().send(event);
}
