import { FC } from 'react';
import { NitroCardGridItemView } from '../../../../layout';
import { AchievementBadgeView } from '../achievement-badge/AchievementBadgeView';
import { AchievementListItemViewProps } from './AchievementListItemView.types';

export const AchievementListItemView: FC<AchievementListItemViewProps> = props =>
{
    const { achievement = null, children = null, ...rest } = props;

    if(!achievement) return null;

    return (
        <NitroCardGridItemView itemCount={ achievement.unseen } itemCountMinimum={ 0 } { ...rest }>
            <AchievementBadgeView achievement={ achievement } />
        </NitroCardGridItemView>
    );
}
