import { IAchievementCategory } from '.';

export const GetAchievementCategoryMaxProgress = (category: IAchievementCategory) =>
{
    if(!category) return 0;

    let progress = 0;

    for(const achievement of category.achievements)
    {
        progress += achievement.levelCount;
    }

    return progress;
}
