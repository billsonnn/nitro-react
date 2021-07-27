import { GetNitroInstance } from '../api';

export function LocalizeBadgeDescription(key: string): string
{
    return GetNitroInstance().localization.getBadgeDesc(key);
}
