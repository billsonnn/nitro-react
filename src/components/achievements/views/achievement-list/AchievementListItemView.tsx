import { AchievementData } from '@nitrots/nitro-renderer';
import { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react';
import { LayoutGridItem } from '../../../../common';
import { AchievementBadgeView } from '../AchievementBadgeView';

interface AchievementListItemViewProps
{
    achievement: AchievementData;
    selectedAchievementId: number;
    setSelectedAchievementId: Dispatch<SetStateAction<number>>;
}

export const AchievementListItemView: FC<PropsWithChildren<AchievementListItemViewProps>> = props =>
{
    const { achievement = null, selectedAchievementId = -1, setSelectedAchievementId = null, children = null, ...rest } = props;

    if(!achievement) return null;

    return (
        <LayoutGridItem itemActive={ (selectedAchievementId === achievement.achievementId) } itemUnseen={ (achievement.unseen > 0) } onClick={ event => setSelectedAchievementId(achievement.achievementId) } { ...rest }>
            <AchievementBadgeView achievement={ achievement } />
            { children }
        </LayoutGridItem>
    );
}
