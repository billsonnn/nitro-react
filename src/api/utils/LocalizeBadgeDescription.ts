import { GetNitroInstance } from '..';

export function LocalizeBadgeDescription(key: string): string
{
    return GetNitroInstance().localization.getBadgeDesc(key);
}
