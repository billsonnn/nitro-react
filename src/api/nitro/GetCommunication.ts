import { INitroCommunicationManager } from 'nitro-renderer';
import { GetNitroInstance } from './GetNitroInstance';

export function GetCommunication(): INitroCommunicationManager
{
    return GetNitroInstance().communication;
}
