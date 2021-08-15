import { INitro, Nitro } from '@nitrots/nitro-renderer';

export function GetNitroInstance(): INitro
{
    return Nitro.instance;
}
