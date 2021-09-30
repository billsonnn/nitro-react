import { FC, useEffect, useMemo, useState } from 'react';
import { NitroLayoutFlexColumn } from '../../../../layout';
import { AchievementDetailsView } from '../achievement-details/AchievementDetailsView';
import { AchievementListView } from '../achievement-list/AchievementListView';
import { AchievementCategoryViewProps } from './AchievementCategoryView.types';

export const AchievementCategoryView: FC<AchievementCategoryViewProps> = props =>
{
    const { category = null, setAchievementSeen = null } = props;
    const [ selectedAchievementId, setSelectedAchievementId ] = useState(0);

    const getSelectedAchievement = useMemo(() =>
    {
        if(!category || !category.achievements.length) return null;

        return category.achievements.find(existing => (existing.achievementId === selectedAchievementId));
    }, [ category, selectedAchievementId ]);

    useEffect(() =>
    {
        let achievementId = 0;

        if(!category || !category.achievements.length)
        {
            achievementId = 0;
        }
        else
        {
            achievementId = category.achievements[0].achievementId;
        }

        setSelectedAchievementId(achievementId);
    }, [ category ]);

    useEffect(() =>
    {
        if(!getSelectedAchievement || !getSelectedAchievement.unseen) return;

        setAchievementSeen(category.code, getSelectedAchievement.achievementId);
    }, [ category, getSelectedAchievement, setAchievementSeen ]);

    if(!category) return null;

    return (
        <NitroLayoutFlexColumn className="justify-content-between h-100" gap={ 2 }>
            <AchievementListView achievements={ category.achievements } selectedAchievementId={ selectedAchievementId } setSelectedAchievementId={ setSelectedAchievementId } />
            { getSelectedAchievement &&
                <AchievementDetailsView achievement={ getSelectedAchievement } /> }
        </NitroLayoutFlexColumn>
    );
}
