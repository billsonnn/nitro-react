import { NitroCardGridItemViewProps } from '../../../../layout';
import { AchievementCategory } from '../../common/AchievementCategory';

export interface AchievementCategoryListItemViewProps extends NitroCardGridItemViewProps
{
    category: AchievementCategory;
}
