import { IConnection, Nitro } from 'nitro-renderer';

export function GetConnection(): IConnection
{
    return Nitro.instance.communication.connection;
}
