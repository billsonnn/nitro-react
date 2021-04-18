import { ISessionDataManager, Nitro } from 'nitro-renderer';

export function GetSessionDataManager(): ISessionDataManager
{
    return Nitro.instance.sessionDataManager;
}
