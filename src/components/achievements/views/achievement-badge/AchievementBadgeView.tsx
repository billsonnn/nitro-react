import { AchievementData } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { BaseProps } from '../../../../common/Base';
import { BadgeImageView } from '../../../../views/shared/badge-image/BadgeImageView';
import { AchievementUtilities } from '../../common/AchievementUtilities';

export interface AchievementBadgeViewProps extends BaseProps<HTMLDivElement>
{
    achievement: AchievementData;
    scale?: number;
}

export const AchievementBadgeView: FC<AchievementBadgeViewProps> = props =>
{
    const { achievement = null, scale = 1, ...rest } = props;

    if(!achievement) return null;

    return (
        <BadgeImageView badgeCode={ AchievementUtilities.getBadgeCode(achievement) } isGrayscale={ !AchievementUtilities.hasStarted(achievement) } scale={ scale } { ...rest } />
    );
}
