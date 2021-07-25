import { GetNitroInstance } from './GetNitroInstance';

export function GetConfiguration<T>(key: string, value: T = null): T
{
    return GetNitroInstance().getConfiguration(key, value);
}
