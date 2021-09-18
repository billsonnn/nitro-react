import { FC } from 'react';
import { useAchievementsContext } from '../../context/AchievementsContext';
import { AchievementCategoryListItemView } from '../category-list-item/AchievementCategoryListItemView';

export const AchievementsListView: FC<{}> = props =>
{
    const { achievementsState = null, dispatchAchievementsState = null } = useAchievementsContext();;
    const { categories = null, selectedCategoryName = null } = achievementsState;
    
    return (
        <div className="row row-cols-3">
            { categories && categories.map((category, index) =>
                {
                    return <AchievementCategoryListItemView key={ index } category={ category } isActive={ selectedCategoryName === category.name } />;
                }) }
        </div>
    );
};
