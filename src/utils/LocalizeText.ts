import { Nitro } from 'nitro-renderer';

export function LocalizeText(key: string, parameters: string[] = null, replacements: string[] = null): string
{
    return Nitro.instance.getLocalizationWithParameters(key, parameters, replacements);
}
