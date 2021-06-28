import classNames from 'classnames';
import { FC, useCallback } from 'react';
import { GetConfiguration } from '../../../../api';
import { useAchievementsContext } from '../../context/AchievementsContext';
import { AchievementsActions } from '../../reducers/AchievementsReducer';
import { AchievementCategory } from '../../utils/AchievementCategory';
import { AchievementListViewProps } from './AchievementListView.types';

export const AchievementsListView: FC<AchievementListViewProps> = props =>
{
    const achievementsContext = useAchievementsContext();
    
    const { achievementsState = null, dispatchAchievementsState = null } = achievementsContext;
    const { categories = null, selectedCategoryName = null } = achievementsState;

    const getCategoryImage = useCallback((category: AchievementCategory) =>
    {
        let level = 0;

        for(const achievement of category.achievements)
        {
            level = (level + ((achievement.finalLevel) ? achievement.level : (achievement.level - 1)));
        }

        const isActive = ((level > 0) ? 'active' : 'inactive');

        return GetConfiguration('achievements.images.url', GetConfiguration('achievements.images.url') + `quests/achcategory_${category.name}_${isActive}.png`).replace('%image%',`achcategory_${category.name}_${isActive}`);
    }, []);

    const getCategoryProgress = useCallback((category: AchievementCategory) =>
    {
        let completed = 0;
        let total = 0;

        for(const achievement of category.achievements)
        {
            if(!achievement) continue;

            if(achievement.finalLevel) completed = completed + 1 + achievement.level;

            total = (total + achievement.scoreLimit);
        }

        return (completed + ' / ' + total);
    }, []);

    const selectCategory = useCallback((name: string) =>
    {
        dispatchAchievementsState({
            type: AchievementsActions.SELECT_CATEGORY,
            payload: {
                selectedCategoryName: name
            }
        });
    }, [ dispatchAchievementsState ]);
    
    return (
        <div className="row row-cols-3">
        { categories && categories.map((category, index) =>
            {
                return <div key={ index } className="col mb-3">
                    <div className={'category border border-2 rounded d-flex flex-column justify-content-center align-items-center p-2' + classNames({' active': selectedCategoryName === category.name})} onClick={() => selectCategory(category.name)}>
                        <img alt="" src={getCategoryImage(category)} />
                        <div className="position-absolute category-score small">{ getCategoryProgress(category) }</div>
                    </div>
                </div>
            }) }
        </div>
            );
};
