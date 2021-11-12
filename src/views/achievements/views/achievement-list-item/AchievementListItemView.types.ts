import { AchievementData } from '@nitrots/nitro-renderer';
import { NitroCardGridItemViewProps } from '../../../../layout';

export interface AchievementListItemViewProps extends NitroCardGridItemViewProps
{
    achievement: AchievementData;
}
