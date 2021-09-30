import { AchievementData } from '@nitrots/nitro-renderer';
import { Dispatch, SetStateAction } from 'react';
import { NitroCardGridViewProps } from '../../../../layout';

export interface AchievementListViewProps extends NitroCardGridViewProps
{
    achievements: AchievementData[];
    selectedAchievementId: number;
    setSelectedAchievementId: Dispatch<SetStateAction<number>>;
}
