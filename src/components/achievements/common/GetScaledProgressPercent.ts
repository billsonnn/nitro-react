import { AchievementData } from '@nitrots/nitro-renderer';

export const GetScaledProgressPercent = (achievement: AchievementData) =>
{
    if(!achievement) return 0;

    return ~~(((((achievement.currentPoints + achievement.scoreAtStartOfLevel) - 0) * (100 - 0)) / ((achievement.scoreLimit + achievement.scoreAtStartOfLevel) - 0)) + 0);
}
