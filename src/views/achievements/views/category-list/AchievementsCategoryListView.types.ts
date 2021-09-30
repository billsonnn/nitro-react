import { Dispatch, SetStateAction } from 'react';
import { NitroCardGridViewProps } from '../../../../layout';
import { AchievementCategory } from '../../common/AchievementCategory';

export interface AchievementsCategoryListViewProps extends NitroCardGridViewProps
{
    categories: AchievementCategory[];
    selectedCategoryCode: string;
    setSelectedCategoryCode: Dispatch<SetStateAction<string>>;
}
