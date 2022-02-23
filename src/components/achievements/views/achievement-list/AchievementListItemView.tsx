import { AchievementData } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LayoutGridItem, LayoutGridItemProps } from '../../../../common/layout/LayoutGridItem';
import { AchievementBadgeView } from '../achievement-badge/AchievementBadgeView';

export interface AchievementListItemViewProps extends LayoutGridItemProps
{
    achievement: AchievementData;
}

export const AchievementListItemView: FC<AchievementListItemViewProps> = props =>
{
    const { achievement = null, children = null, ...rest } = props;

    if(!achievement) return null;

    return (
        <LayoutGridItem itemCount={ achievement.unseen } itemCountMinimum={ 0 } { ...rest }>
            <AchievementBadgeView achievement={ achievement } />
            { children }
        </LayoutGridItem>
    );
}
