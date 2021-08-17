import { GetNitroInstance } from '..';

export function LocalizeText(key: string, parameters: string[] = null, replacements: string[] = null): string
{
    return GetNitroInstance().getLocalizationWithParameters(key, parameters, replacements);
}
