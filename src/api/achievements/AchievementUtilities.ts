import { AchievementData, GetLocalizationManager } from '@nitrots/nitro-renderer';
import { GetConfigurationValue } from '../nitro';
import { IAchievementCategory } from './IAchievementCategory';

export class AchievementUtilities
{
    public static getAchievementBadgeCode(achievement: AchievementData): string
    {
        if(!achievement) return null;
    
        let badgeId = achievement.badgeId;
    
        if(!achievement.finalLevel) badgeId = GetLocalizationManager().getPreviousLevelBadgeId(badgeId);
    
        return badgeId;
    }

    public static getAchievementCategoryImageUrl(category: IAchievementCategory, progress: number = null, icon: boolean = false): string
    {
        const imageUrl = GetConfigurationValue<string>('achievements.images.url');
    
        let imageName = icon ? 'achicon_' : 'achcategory_';
        
        imageName += category.code;
    
        if(progress !== null) imageName += `_${ ((progress > 0) ? 'active' : 'inactive') }`;
    
        return imageUrl.replace('%image%', imageName);
    }

    public static getAchievementCategoryMaxProgress(category: IAchievementCategory): number
    {
        if(!category) return 0;
    
        let progress = 0;
    
        for(const achievement of category.achievements)
        {
            progress += achievement.levelCount;
        }
    
        return progress;
    }

    public static getAchievementCategoryProgress(category: IAchievementCategory): number
    {
        if(!category) return 0;
    
        let progress = 0;
    
        for(const achievement of category.achievements) progress += (achievement.finalLevel ? achievement.level : (achievement.level - 1));
    
        return progress;
    }

    public static getAchievementCategoryTotalUnseen(category: IAchievementCategory): number
    {
        if(!category) return 0;
    
        let unseen = 0;
    
        for(const achievement of category.achievements) ((achievement.unseen > 0) && unseen++);
    
        return unseen;
    }

    public static getAchievementHasStarted(achievement: AchievementData): boolean
    {
        if(!achievement) return false;
    
        if(achievement.finalLevel || ((achievement.level - 1) > 0)) return true;
    
        return false;
    }

    public static getAchievementIsIgnored(achievement: AchievementData): boolean
    {
        if(!achievement) return false;
    
        const ignored = GetConfigurationValue<string[]>('achievements.unseen.ignored');
        const value = achievement.badgeId.replace(/[0-9]/g, '');
        const index = ignored.indexOf(value);
    
        if(index >= 0) return true;
    
        return false;
    }

    public static getAchievementLevel(achievement: AchievementData): number
    {
        if(!achievement) return 0;
        
        if(achievement.finalLevel) return achievement.level;
    
        return (achievement.level - 1);
    }
}
