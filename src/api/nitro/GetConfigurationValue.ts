import { GetConfiguration } from '@nitrots/nitro-renderer';

export function GetConfigurationValue<T>(key: string, value: T = null): T
{
    return GetConfiguration().getValue(key, value);
}
