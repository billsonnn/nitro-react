import { IMessageEvent, MessageEvent } from '@nitrots/nitro-renderer';
import { useEffect } from 'react';
import { GetCommunication } from '../../api';

export function UseMessageEventHook(eventType: typeof MessageEvent, handler: (event: IMessageEvent) => void): void
{
    useEffect(() =>
    {
        //@ts-ignore
        const event = new eventType(handler);
        
        GetCommunication().registerMessageEvent(event);
        
        return () => GetCommunication().removeMessageEvent(event);
    }, [ eventType, handler ]);
}
