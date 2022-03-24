import { IAchievementCategory } from '.';

export const GetAchievementCategoryProgress = (category: IAchievementCategory) =>
{
    if(!category) return 0;

    let progress = 0;

    for(const achievement of category.achievements) progress += (achievement.finalLevel ? achievement.level : (achievement.level - 1));

    return progress;
}
