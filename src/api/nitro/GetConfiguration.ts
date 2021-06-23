import { Nitro } from 'nitro-renderer';

export function GetConfiguration<T>(key: string, value: T = null): T
{
    return Nitro.instance.getConfiguration(key, value);
}
