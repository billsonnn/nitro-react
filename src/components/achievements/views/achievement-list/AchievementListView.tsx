import { AchievementData } from '@nitrots/nitro-renderer';
import { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react';
import { AutoGrid } from '../../../../common';
import { AchievementListItemView } from './AchievementListItemView';

interface AchievementListViewProps
{
    achievements: AchievementData[];
    selectedAchievementId: number;
    setSelectedAchievementId: Dispatch<SetStateAction<number>>;
}

export const AchievementListView: FC<PropsWithChildren<AchievementListViewProps>> = props =>
{
    const { achievements = null, selectedAchievementId = -1, setSelectedAchievementId = null, children = null, ...rest } = props;

    return (
        <AutoGrid columnCount={ 6 } columnMinWidth={ 50 } columnMinHeight={ 50 } { ...rest }>
            { achievements && (achievements.length > 0) && achievements.map((achievement, index) => <AchievementListItemView key={ index } achievement={ achievement } selectedAchievementId={ selectedAchievementId } setSelectedAchievementId={ setSelectedAchievementId } />) }
            { children }
        </AutoGrid>
    );
}
