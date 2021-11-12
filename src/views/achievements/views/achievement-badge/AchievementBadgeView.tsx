import { FC } from 'react';
import { BadgeImageView } from '../../../shared/badge-image/BadgeImageView';
import { AchievementUtilities } from '../../common/AchievementUtilities';
import { AchievementBadgeViewProps } from './AchievementBadgeView.types';

export const AchievementBadgeView: FC<AchievementBadgeViewProps> = props =>
{
    const { achievement = null, scale = 1, ...rest } = props;

    if(!achievement) return null;

    return (
        <BadgeImageView badgeCode={ AchievementUtilities.getBadgeCode(achievement) } isGrayscale={ !AchievementUtilities.hasStarted(achievement) } scale={ scale } { ...rest } />
    );
}
