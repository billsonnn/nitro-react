import { IMessageComposer } from '@nitrots/nitro-renderer';
import { GetConnection } from './GetConnection';

export const SendMessageComposer = (event: IMessageComposer<unknown[]>) => GetConnection().send(event);
