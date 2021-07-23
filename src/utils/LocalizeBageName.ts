import { GetNitroInstance } from '../api';

export function LocalizeBadgeName(key: string): string
{
    return GetNitroInstance().localization.getBadgeName(key);
}
