import { GetNitroInstance } from '..';

export function LocalizeBadgeName(key: string): string
{
    return GetNitroInstance().localization.getBadgeName(key);
}
