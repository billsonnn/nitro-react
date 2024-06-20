import { AchievementData } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { AchievementUtilities } from '../../api';
import { BaseProps, LayoutBadgeImageView } from '../../common';

interface AchievementBadgeViewProps extends BaseProps<HTMLDivElement>
{
    achievement: AchievementData;
    scale?: number;
}

export const AchievementBadgeView: FC<AchievementBadgeViewProps> = props =>
{
    const { achievement = null, scale = 1, ...rest } = props;

    if(!achievement) return null;

    return <LayoutBadgeImageView badgeCode={ AchievementUtilities.getAchievementBadgeCode(achievement) } isGrayscale={ !AchievementUtilities.getAchievementHasStarted(achievement) } scale={ scale } { ...rest } />;
};
