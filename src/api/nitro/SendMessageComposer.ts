import { GetCommunication, IMessageComposer } from '@nitrots/nitro-renderer';

export const SendMessageComposer = (event: IMessageComposer<unknown[]>) => GetCommunication().connection.send(event);
