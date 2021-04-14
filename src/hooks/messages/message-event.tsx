import { IMessageEvent } from 'nitro-renderer';
import { Nitro } from 'nitro-renderer/src/nitro/Nitro';
import { useEffect } from 'react';

export function CreateMessageHook(event: IMessageEvent)
{
    useEffect(() =>
    {
        Nitro.instance.communication.registerMessageEvent(event);
        
        return () =>
        {
            Nitro.instance.communication.removeMessageEvent(event);
        }
    });
}
