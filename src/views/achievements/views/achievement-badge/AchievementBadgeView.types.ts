import { AchievementData } from '@nitrots/nitro-renderer';
import { NitroLayoutBaseProps } from '../../../../layout/base';

export interface AchievementBadgeViewProps extends NitroLayoutBaseProps
{
    achievement: AchievementData;
    scale?: number;
}
