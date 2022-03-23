import { AchievementData } from '@nitrots/nitro-renderer';

export const GetAchievementHasStarted = (achievement: AchievementData) =>
{
    if(!achievement) return false;

    if(achievement.finalLevel || ((achievement.level - 1) > 0)) return true;

    return false;
}
