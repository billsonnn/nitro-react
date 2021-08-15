import { INitroCore } from '@nitrots/nitro-renderer';
import { GetNitroInstance } from '../nitro';

export function GetNitroCore(): INitroCore
{
    return GetNitroInstance().core;
}
