import classNames from 'classnames';
import { FC, useCallback, useMemo } from 'react';
import { GetConfiguration } from '../../../../api';
import { useAchievementsContext } from '../../context/AchievementsContext';
import { AchievementsActions } from '../../reducers/AchievementsReducer';
import { AchievementCategoryListItemViewProps } from './AchievementCategoryListItemView.types';

export const AchievementCategoryListItemView: FC<AchievementCategoryListItemViewProps> = props =>
{
    const { category = null, isActive = false } = props;
    const { dispatchAchievementsState = null } = useAchievementsContext();

    const categoryLevel = useMemo(() =>
    {
        let level = 0;

        for(const achievement of category.achievements)
        {
            level = (level + (achievement.finalLevel ? achievement.level : (achievement.level - 1)));
        }

        return level;
    }, [ category ]);

    const getCategoryImage = useMemo(() =>
    {
        const level = categoryLevel;
        const imageUrl = GetConfiguration<string>('achievements.images.url');

        return imageUrl.replace('%image%', `achcategory_${ category.name }_${ ((level > 0) ? 'active' : 'inactive') }`);
    }, [ category, categoryLevel ]);

    const getCategoryProgress = useMemo(() =>
    {
        let completed = 0;
        let total = 0;

        for(const achievement of category.achievements)
        {
            if(!achievement) continue;

            if(achievement.firstLevelAchieved) completed = (completed + ((achievement.finalLevel) ? achievement.level : (achievement.level - 1)));

            total += achievement.scoreLimit;
        }

        return (completed + ' / ' + total);
    }, [ category ]);

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
        <div className="col mb-3">
            <div className={ 'd-flex flex-column justify-content-center align-items-center category border border-2 rounded p-2' + classNames({ ' active': isActive }) } onClick={ () => selectCategory(category.name) }>
                <img src={ getCategoryImage } alt="" />
                <div className="position-absolute category-score small">{ getCategoryProgress }</div>
            </div>
        </div>
    );
}
