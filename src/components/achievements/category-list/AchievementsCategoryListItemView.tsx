import { Dispatch, FC, SetStateAction } from 'react';
import { AchievementUtilities, IAchievementCategory, LocalizeText } from '../../../api';
import { LayoutBackgroundImage, LayoutGridItem, Text } from '../../../common';

interface AchievementCategoryListItemViewProps
{
    category: IAchievementCategory;
    selectedCategoryCode: string;
    setSelectedCategoryCode: Dispatch<SetStateAction<string>>;
}

export const AchievementsCategoryListItemView: FC<AchievementCategoryListItemViewProps> = props =>
{
    const { category = null, selectedCategoryCode = null, setSelectedCategoryCode = null } = props;

    if(!category) return null;

    const progress = AchievementUtilities.getAchievementCategoryProgress(category);
    const maxProgress = AchievementUtilities.getAchievementCategoryMaxProgress(category);
    const getCategoryImage = AchievementUtilities.getAchievementCategoryImageUrl(category, progress);
    const getTotalUnseen = AchievementUtilities.getAchievementCategoryTotalUnseen(category);

    return (
        <LayoutGridItem gap={ 1 } itemActive={ (selectedCategoryCode === category.code) } itemCount={ getTotalUnseen } itemCountMinimum={ 0 } onClick={ event => setSelectedCategoryCode(category.code) }>
            <Text center fullWidth small className="pt-1">{ LocalizeText(`quests.${ category.code }.name`) }</Text>
            <LayoutBackgroundImage imageUrl={ getCategoryImage } position="relative">
                <Text center fullWidth position="absolute" style={ { fontSize: 12, bottom: 9 } } variant="white">{ progress } / { maxProgress }</Text>
            </LayoutBackgroundImage>
        </LayoutGridItem>
    );
};
