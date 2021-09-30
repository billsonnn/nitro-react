import { FC } from 'react';
import { NitroCardGridView } from '../../../../layout';
import { AchievementListItemView } from '../achievement-list-item/AchievementListItemView';
import { AchievementListViewProps } from './AchievementListView.types';

export const AchievementListView: FC<AchievementListViewProps> = props =>
{
    const { achievements = null, selectedAchievementId = 0, setSelectedAchievementId = null, ...rest } = props;

    return (
        <NitroCardGridView { ...rest }>
            { achievements && (achievements.length > 0) && achievements.map(achievement =>
                {
                    return <AchievementListItemView key={ achievement.achievementId } achievement={ achievement } itemActive={ (selectedAchievementId === achievement.achievementId) } onClick={ event => setSelectedAchievementId(achievement.achievementId) } />;
                }) }
        </NitroCardGridView>
    );
}
