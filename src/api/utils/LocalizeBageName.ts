import { GetNitroInstance } from '..';

export const LocalizeBadgeName = (key: string) =>
{
    let badgeName = GetNitroInstance().localization.getBadgeName(key);

    if(!badgeName || !badgeName.length) badgeName = `badge_name_${ key }`;

    return badgeName;
}
