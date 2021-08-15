import { ISessionDataManager } from '@nitrots/nitro-renderer';
import { GetNitroInstance } from '../GetNitroInstance';

export function GetSessionDataManager(): ISessionDataManager
{
    return GetNitroInstance().sessionDataManager;
}
