import { INitroCore } from 'nitro-renderer';
import { GetNitroInstance } from '../nitro';

export function GetNitroCore(): INitroCore
{
    return GetNitroInstance().core;
}
