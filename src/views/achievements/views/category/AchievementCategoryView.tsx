import classNames from 'classnames';
import { AchievementData } from 'nitro-renderer';
import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { BadgeImageView } from '../../../shared/badge-image/BadgeImageView';
import { useAchievementsContext } from '../../context/AchievementsContext';
import { AchievementsActions } from '../../reducers/AchievementsReducer';
import { AchievementCategoryViewProps } from './AchievementCategoryView.types';

export const AchievementCategoryView: FC<AchievementCategoryViewProps> = props =>
{
    const achievementsContext = useAchievementsContext();
    
    const { achievementsState = null, dispatchAchievementsState = null } = achievementsContext;
    const { categories = null, selectedCategoryName = null, selectedAchievementId = null } = achievementsState;

    const getSelectedCategory = useCallback(() =>
    {
        return categories.find(category => category.name === selectedCategoryName);
    }, [ categories, selectedCategoryName ]);

    const getAchievementImage = useCallback((achievement: AchievementData) =>
    {
        if(!achievement) return null;
        
        let badgeId = achievement.badgeId;

        if(achievement.levelCount > 1)
        {
            badgeId = badgeId.replace(/[0-9]/g, '');
            badgeId = (badgeId + (((achievement.level - 1) > 0) ? (achievement.level - 1) : achievement.level));
        }

        return badgeId;
    }, []);

    const getSelectedAchievement = useCallback(() =>
    {
        if(!getSelectedCategory()) return null;
        
        return getSelectedCategory().achievements.find(achievement => achievement.achievementId === selectedAchievementId);
    }, [ getSelectedCategory, selectedAchievementId ]);

    const selectAchievement = useCallback((id: number) =>
    {
        dispatchAchievementsState({
            type: AchievementsActions.SELECT_ACHIEVEMENT,
            payload: {
                selectedAchievementId: id
            }
        });
    }, [ dispatchAchievementsState ]);


    return (
        <div className="d-flex flex-column h-100">
            <div className="bg-primary rounded p-2 d-flex align-items-center mb-3">
                <h5 className="m-0 me-2 w-100">{ LocalizeText('quests.' + selectedCategoryName + '.name') }</h5>
                <div>IMAGE</div>
            </div>
            <div className="bg-muted rounded p-2 mb-3 d-flex">
                <div>
                    <BadgeImageView badgeCode={ getAchievementImage(getSelectedAchievement()) } />
                </div>
            </div>
            <div className="achievements">
                <div className="row row-cols-4">
                    { getSelectedCategory().achievements.map((achievement, index) =>
                        {
                            return (
                            <div key={ index } className="col mb-3">
                                <div className={'achievement border border-2 rounded d-flex flex-column justify-content-center align-items-center p-2' + classNames({' active': selectedAchievementId === achievement.achievementId, ' gray': achievement.progress === 0})} onClick={() => selectAchievement(achievement.achievementId)}>
                                    <BadgeImageView badgeCode={ getAchievementImage(achievement) } />
                                </div>
                            </div>
                            )
                        }) }
                </div>
            </div>
        </div>
    );
}
