import { FC, useEffect, useMemo, useState } from 'react';
import { AchievementCategory } from '../../../api';
import { Column } from '../../../common';
import { AchievementListView } from './achievement-list/AchievementListView';
import { AchievementDetailsView } from './AchievementDetailsView';

interface AchievementCategoryViewProps
{
    category: AchievementCategory;
    setAchievementSeen: (code: string, achievementId: number) => void;
}

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
        setSelectedAchievementId((!category || !category.achievements.length) ? 0 : category.achievements[0].achievementId);
    }, [ category ]);

    useEffect(() =>
    {
        if(!getSelectedAchievement || !getSelectedAchievement.unseen) return;

        setAchievementSeen(category.code, getSelectedAchievement.achievementId);
    }, [ category, getSelectedAchievement, setAchievementSeen ]);

    if(!category) return null;

    return (
        <Column fullHeight justifyContent="between">
            <AchievementListView achievements={ category.achievements } selectedAchievementId={ selectedAchievementId } setSelectedAchievementId={ setSelectedAchievementId } />
            { getSelectedAchievement &&
                <AchievementDetailsView achievement={ getSelectedAchievement } /> }
        </Column>
    );
}
