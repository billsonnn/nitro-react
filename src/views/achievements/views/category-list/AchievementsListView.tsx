import { FC } from 'react';
import { NitroCardGridView } from '../../../../layout/card/grid/NitroCardGridView';
import { useAchievementsContext } from '../../context/AchievementsContext';
import { AchievementCategoryListItemView } from '../category-list-item/AchievementCategoryListItemView';

export const AchievementsListView: FC<{}> = props =>
{
    const { achievementsState = null, dispatchAchievementsState = null } = useAchievementsContext();;
    const { categories = null, selectedCategoryName = null } = achievementsState;
    
    return (
        <NitroCardGridView columns={ 3 }>
            { categories && categories.map((category, index) =>
                {
                    return <AchievementCategoryListItemView key={ index } category={ category } />;
                }) }
        </NitroCardGridView>
    );
};
