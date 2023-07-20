import { IConnection } from '@nitrots/nitro-renderer';
import { GetCommunication } from './GetCommunication';

export function GetConnection(): IConnection
{
    return GetCommunication()?.connection;
}
