import { Nitro } from 'nitro-renderer';

export function LocalizeBadgeName(key: string): string
{
    return Nitro.instance.localization.getBadgeName(key);
}
