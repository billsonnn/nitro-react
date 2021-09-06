import { INitroLocalizationManager } from '@nitrots/nitro-renderer';
import { GetNitroInstance } from './GetNitroInstance';

export function GetLocalization(): INitroLocalizationManager
{
    return GetNitroInstance().localization;
}
