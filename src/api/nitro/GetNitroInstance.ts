import { INitro, Nitro } from 'nitro-renderer';

export function GetNitroInstance(): INitro
{
    return Nitro.instance;
}
