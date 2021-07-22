import { ISessionDataManager } from 'nitro-renderer';
import { GetNitroInstance } from '../GetNitroInstance';

export function GetSessionDataManager(): ISessionDataManager
{
    return GetNitroInstance().sessionDataManager;
}
