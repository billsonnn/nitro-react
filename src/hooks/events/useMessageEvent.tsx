import {
    GetCommunication,
    IMessageEvent,
    MessageEvent,
} from '@nitrots/nitro-renderer';
import { useEffect } from 'react';

export const useMessageEvent = <T extends IMessageEvent>(
    eventType: typeof MessageEvent,
    handler: (event: T) => void
) =>
{
    useEffect(() =>
    {
        //@ts-ignore
        const event = new eventType(handler);

        GetCommunication().registerMessageEvent(event);

        return () => GetCommunication().removeMessageEvent(event);
    }, [eventType, handler]);
};
