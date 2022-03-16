import { GetNitroInstance } from '..';

export const LocalizeBadgeDescription = (key: string) =>
{
    let badgeDesc = GetNitroInstance().localization.getBadgeDesc(key);

    if(!badgeDesc || !badgeDesc.length) badgeDesc = `badge_desc_${ key }`;

    return badgeDesc;
}
