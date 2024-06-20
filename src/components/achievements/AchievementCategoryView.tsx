import { FC, useEffect } from 'react';
import { AchievementCategory } from '../../api';
import { Column } from '../../common';
import { useAchievements } from '../../hooks';
import { AchievementDetailsView } from './AchievementDetailsView';
import { AchievementListView } from './achievement-list';

interface AchievementCategoryViewProps {
    category: AchievementCategory;
}

export const AchievementCategoryView: FC<AchievementCategoryViewProps> = (
    props,
) =>
{
    const { category = null } = props;
    const { selectedAchievement = null, setSelectedAchievementId = null } =
        useAchievements();

    useEffect(() =>
    {
        if(!category) return;

        if(!selectedAchievement)
        {
            setSelectedAchievementId(
                category?.achievements?.[0]?.achievementId,
            );
        }
    }, [category, selectedAchievement, setSelectedAchievementId]);

    if(!category) return null;

    return (
        <Column fullHeight justifyContent="between">
            <AchievementListView achievements={category.achievements} />
            {!!selectedAchievement && (
                <AchievementDetailsView achievement={selectedAchievement} />
            )}
        </Column>
    );
};
