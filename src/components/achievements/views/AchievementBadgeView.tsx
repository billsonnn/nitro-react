import { AchievementData } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { GetAchievementBadgeCode, GetAchievementHasStarted } from '../../../api';
import { BaseProps, LayoutBadgeImageView } from '../../../common';

interface AchievementBadgeViewProps extends BaseProps<HTMLDivElement>
{
    achievement: AchievementData;
    scale?: number;
}

export const AchievementBadgeView: FC<AchievementBadgeViewProps> = props =>
{
    const { achievement = null, scale = 1, ...rest } = props;

    if(!achievement) return null;

    return <LayoutBadgeImageView badgeCode={ GetAchievementBadgeCode(achievement) } isGrayscale={ !GetAchievementHasStarted(achievement) } scale={ scale } { ...rest } />;
}
