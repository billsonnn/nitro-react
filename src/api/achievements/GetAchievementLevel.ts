import { AchievementData } from '@nitrots/nitro-renderer';

export const GetAchievementLevel = (achievement: AchievementData) =>
{
    if(!achievement) return 0;
    
    if(achievement.finalLevel) return achievement.level;

    return (achievement.level - 1);
}
