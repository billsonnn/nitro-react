import { AchievementCategory } from '../../common/AchievementCategory';

export class AchievementCategoryViewProps
{
    category: AchievementCategory;
    setAchievementSeen: (code: string, achievementId: number) => void;
}
