import { GetLocalizationManager } from '@nitrots/nitro-renderer';

export function LocalizeText(key: string, parameters: string[] = null, replacements: string[] = null): string
{
    return GetLocalizationManager().getValueWithParameters(key, parameters, replacements);
}
