import { FC, useCallback, useMemo } from 'react';
import { GetConfiguration, LocalizeText } from '../../../../api';
import { LayoutGridItem, LayoutGridItemProps } from '../../../../common/layout/LayoutGridItem';
import { LayoutImage } from '../../../../common/layout/LayoutImage';
import { Text } from '../../../../common/Text';
import { AchievementCategory } from '../../common/AchievementCategory';

export interface AchievementCategoryListItemViewProps extends LayoutGridItemProps
{
    category: AchievementCategory;
}

export const AchievementsCategoryListItemView: FC<AchievementCategoryListItemViewProps> = props =>
{
    const { category = null, ...rest } = props;

    const progress = category.getProgress();
    const maxProgress = category.getMaxProgress();

    const getCategoryImage = useMemo(() =>
    {
        const imageUrl = GetConfiguration<string>('achievements.images.url');

        return imageUrl.replace('%image%', `achcategory_${ category.code }_${ ((progress > 0) ? 'active' : 'inactive') }`);
    }, [ category, progress ]);

    const getTotalUnseen = useCallback(() =>
    {
        let unseen = 0;

        for(const achievement of category.achievements) unseen += achievement.unseen;

        return unseen;
    }, [ category ]);

    return (
        <LayoutGridItem itemCount={ getTotalUnseen() } itemCountMinimum={ 0 } gap={ 1 } { ...rest }>
            <Text fullWidth center className="small pt-1">{ LocalizeText(`quests.${ category.code }.name`) }</Text>
            <LayoutImage position="relative" imageUrl={ getCategoryImage }>
                <Text fullWidth center position="absolute" variant="white" style={ { fontSize: 12, bottom: 9 } }>{ progress } / { maxProgress }</Text>
            </LayoutImage>
        </LayoutGridItem>
    );
}
