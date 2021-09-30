import { AchievementData } from '@nitrots/nitro-renderer';
import { GetConfiguration, GetLocalization } from '../../../api';

export class AchievementUtilities
{
    public static hasStarted(achievement: AchievementData): boolean
    {
        if(!achievement) return false;

        if(achievement.finalLevel || ((achievement.level - 1) > 0)) return true;

        return false;
    }

    public static getBadgeCode(achievement: AchievementData): string
    {
        if(!achievement) return null;

        let badgeId = achievement.badgeId;

        if(!achievement.finalLevel) badgeId = GetLocalization().getPreviousLevelBadgeId(badgeId);

        return badgeId;
    }

    public static isIgnoredAchievement(achievement: AchievementData): boolean
    {
        if(!achievement) return false;

        const ignored = GetConfiguration<string[]>('achievements.unseen.ignored');
        const value = achievement.badgeId.replace(/[0-9]/g, '');
        const index = ignored.indexOf(value);

        if(index >= 0) return true;

        return false;
    }
}
