import { GetConfiguration, IAchievementCategory } from '..';

export const GetAchievementCategoryImageUrl = (category: IAchievementCategory, progress: number = null) =>
{
    const imageUrl = GetConfiguration<string>('achievements.images.url');

    let imageName = `achcategory_${ category.code }`;

    if(progress !== null) imageName += `_${ ((progress > 0) ? 'active' : 'inactive') }`;

    return imageUrl.replace('%image%', imageName);
}
