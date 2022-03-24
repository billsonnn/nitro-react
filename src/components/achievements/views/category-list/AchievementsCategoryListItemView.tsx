import { FC } from 'react';
import { GetAchievementCategoryImageUrl, GetAchievementCategoryMaxProgress, GetAchievementCategoryProgress, GetAchievementCategoryTotalUnseen, IAchievementCategory, LocalizeText } from '../../../../api';
import { LayoutBackgroundImage, LayoutGridItem, LayoutGridItemProps, Text } from '../../../../common';

export interface AchievementCategoryListItemViewProps extends LayoutGridItemProps
{
    category: IAchievementCategory;
}

export const AchievementsCategoryListItemView: FC<AchievementCategoryListItemViewProps> = props =>
{
    const { category = null, children = null, ...rest } = props;

    const progress = GetAchievementCategoryProgress(category);
    const maxProgress = GetAchievementCategoryMaxProgress(category);
    const getCategoryImage = GetAchievementCategoryImageUrl(category, progress);
    const getTotalUnseen = GetAchievementCategoryTotalUnseen(category);

    return (
        <LayoutGridItem itemCount={ getTotalUnseen } itemCountMinimum={ 0 } gap={ 1 } { ...rest }>
            <Text fullWidth center className="small pt-1">{ LocalizeText(`quests.${ category.code }.name`) }</Text>
            <LayoutBackgroundImage className="position-relative" imageUrl={ getCategoryImage }>
                <Text fullWidth center position="absolute" variant="white" style={ { fontSize: 12, bottom: 9 } }>{ progress } / { maxProgress }</Text>
            </LayoutBackgroundImage>
            { children }
        </LayoutGridItem>
    );
}
