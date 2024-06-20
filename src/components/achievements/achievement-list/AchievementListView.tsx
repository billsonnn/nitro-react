import { AchievementData } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { AutoGrid } from '../../../common';
import { AchievementListItemView } from './AchievementListItemView';

interface AchievementListViewProps
{
    achievements: AchievementData[];
}

export const AchievementListView: FC<AchievementListViewProps> = props =>
{
    const { achievements = null } = props;

    return (
        <AutoGrid columnCount={ 6 } columnMinHeight={ 50 } columnMinWidth={ 50 }>
            { achievements && (achievements.length > 0) && achievements.map((achievement, index) => <AchievementListItemView key={ index } achievement={ achievement } />) }
        </AutoGrid>
    );
};
