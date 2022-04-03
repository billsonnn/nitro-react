import { IAchievementCategory } from '.';

export const GetAchievementCategoryTotalUnseen = (category: IAchievementCategory) =>
{
    if(!category) return 0;

    let unseen = 0;

    for(const achievement of category.achievements) ((achievement.unseen > 0) && unseen++);

    return unseen;
}
