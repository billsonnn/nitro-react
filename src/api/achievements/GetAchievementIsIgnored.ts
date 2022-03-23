import { AchievementData } from '@nitrots/nitro-renderer';
import { GetConfiguration } from '..';

export const GetAchievementIsIgnored = (achievement: AchievementData) =>
{
    if(!achievement) return false;

    const ignored = GetConfiguration<string[]>('achievements.unseen.ignored');
    const value = achievement.badgeId.replace(/[0-9]/g, '');
    const index = ignored.indexOf(value);

    if(index >= 0) return true;

    return false;
}
