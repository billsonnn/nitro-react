import { NitroConfiguration } from '@nitrots/nitro-renderer';

export function GetConfiguration<T>(key: string, value: T = null): T
{
    return NitroConfiguration.getValue(key, value);
}
