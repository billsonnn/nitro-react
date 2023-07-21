import { IConfigurationManager } from '@nitrots/nitro-renderer';
import { GetNitroInstance } from './GetNitroInstance';

export function GetConfigurationManager(): IConfigurationManager
{
    return GetNitroInstance().configuration;
}
