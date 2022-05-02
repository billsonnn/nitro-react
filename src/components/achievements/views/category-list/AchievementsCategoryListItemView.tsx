import { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react';
import { GetAchievementCategoryImageUrl, GetAchievementCategoryMaxProgress, GetAchievementCategoryProgress, GetAchievementCategoryTotalUnseen, IAchievementCategory, LocalizeText } from '../../../../api';
import { LayoutBackgroundImage, LayoutGridItem, Text } from '../../../../common';

interface AchievementCategoryListItemViewProps
{
    category: IAchievementCategory;
    selectedCategoryCode: string;
    setSelectedCategoryCode: Dispatch<SetStateAction<string>>;
}

export const AchievementsCategoryListItemView: FC<PropsWithChildren<AchievementCategoryListItemViewProps>> = props =>
{
    const { category = null, selectedCategoryCode = null, setSelectedCategoryCode = null, children = null, ...rest } = props;

    if(!category) return null;

    const progress = GetAchievementCategoryProgress(category);
    const maxProgress = GetAchievementCategoryMaxProgress(category);
    const getCategoryImage = GetAchievementCategoryImageUrl(category, progress);
    const getTotalUnseen = GetAchievementCategoryTotalUnseen(category);

    return (
        <LayoutGridItem itemActive={ (selectedCategoryCode === category.code) } itemCount={ getTotalUnseen } itemCountMinimum={ 0 } gap={ 1 } onClick={ event => setSelectedCategoryCode(category.code) } { ...rest }>
            <Text fullWidth center small className="pt-1">{ LocalizeText(`quests.${ category.code }.name`) }</Text>
            <LayoutBackgroundImage position="relative" imageUrl={ getCategoryImage }>
                <Text fullWidth center position="absolute" variant="white" style={ { fontSize: 12, bottom: 9 } }>{ progress } / { maxProgress }</Text>
            </LayoutBackgroundImage>
            { children }
        </LayoutGridItem>
    );
}
