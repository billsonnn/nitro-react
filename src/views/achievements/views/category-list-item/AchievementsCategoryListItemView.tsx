import { FC, useCallback, useMemo } from 'react';
import { GetConfiguration } from '../../../../api';
import { NitroCardGridItemView } from '../../../../layout';
import { NitroLayoutBase } from '../../../../layout/base';
import { AchievementCategoryListItemViewProps } from './AchievementCategoryListItemView.types';

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
        <NitroCardGridItemView itemImage={ getCategoryImage } itemCount={ getTotalUnseen() } itemCountMinimum={ 0 } { ...rest }>
            <NitroLayoutBase className="text-black small">{ category.code }</NitroLayoutBase>
            <NitroLayoutBase className="achievement-score small" position="absolute">
                { progress } / { maxProgress }
            </NitroLayoutBase>
        </NitroCardGridItemView>
    );
}
