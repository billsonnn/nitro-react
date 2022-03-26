import { GetConfiguration, IAchievementCategory } from '..';

export const GetAchievementCategoryImageUrl = (category: IAchievementCategory, progress: number = null, icon: boolean = false) =>
{
    const imageUrl = GetConfiguration<string>('achievements.images.url');

    let imageName = icon ? 'achicon_' : 'achcategory_';
    
    imageName += category.code;

    if(progress !== null) imageName += `_${ ((progress > 0) ? 'active' : 'inactive') }`;

    return imageUrl.replace('%image%', imageName);
}
