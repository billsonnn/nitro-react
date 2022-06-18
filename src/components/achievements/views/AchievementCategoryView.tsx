import { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react';
import { AchievementCategory } from '../../../api';
import { Column } from '../../../common';
import { AchievementListView } from './achievement-list/AchievementListView';
import { AchievementDetailsView } from './AchievementDetailsView';

interface AchievementCategoryViewProps
{
    category: AchievementCategory;
    selectedAchievementId: number;
    setSelectedAchievementId: Dispatch<SetStateAction<number>>;
    setAchievementSeen: (code: string, achievementId: number) => void;
}

export const AchievementCategoryView: FC<AchievementCategoryViewProps> = props =>
{
    const { category = null, selectedAchievementId = -1, setSelectedAchievementId = null, setAchievementSeen = null } = props;

    const selectedAchievement = useMemo(() =>
    {
        if(selectedAchievementId === -1) return null;

        return category.achievements.find(achievement => (achievement.achievementId === selectedAchievementId));
    }, [ category, selectedAchievementId ]);

    useEffect(() =>
    {
        if(!selectedAchievement)
        {
            if(category.achievements.length) setSelectedAchievementId(category.achievements[0].achievementId);
        }
    }, [ selectedAchievement, category, setSelectedAchievementId ]);

    useEffect(() =>
    {
        if(!selectedAchievement) return;

        setAchievementSeen(category.code, selectedAchievement.achievementId);
    }, [ selectedAchievement, category, setAchievementSeen ]);

    if(!category) return null;

    return (
        <Column fullHeight justifyContent="between">
            <AchievementListView achievements={ category.achievements } selectedAchievementId={ selectedAchievementId } setSelectedAchievementId={ setSelectedAchievementId } />
            { !!selectedAchievement &&
                <AchievementDetailsView achievement={ selectedAchievement } /> }
        </Column>
    );
}
