import { AchievementData } from '@nitrots/nitro-renderer';
import { GetLocalization } from '..';

export const GetAchievementBadgeCode = (achievement: AchievementData) =>
{
    if(!achievement) return null;

    let badgeId = achievement.badgeId;

    if(!achievement.finalLevel) badgeId = GetLocalization().getPreviousLevelBadgeId(badgeId);

    return badgeId;
}
