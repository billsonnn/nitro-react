import { IConfigurationManager } from '@nitrots/nitro-renderer';
import { GetNitroCore } from './GetNitroCore';

export function GetConfigurationManager(): IConfigurationManager
{
    return GetNitroCore().configuration;
}
