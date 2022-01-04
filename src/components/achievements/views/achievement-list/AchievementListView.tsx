import { AchievementData } from '@nitrots/nitro-renderer';
import { Dispatch, FC, SetStateAction } from 'react';
import { Grid, GridProps } from '../../../../common/Grid';
import { AchievementListItemView } from './AchievementListItemView';

export interface AchievementListViewProps extends GridProps
{
    achievements: AchievementData[];
    selectedAchievementId: number;
    setSelectedAchievementId: Dispatch<SetStateAction<number>>;
}

export const AchievementListView: FC<AchievementListViewProps> = props =>
{
    const { achievements = null, selectedAchievementId = 0, setSelectedAchievementId = null, children = null, ...rest } = props;

    return (
        <Grid grow columnCount={ 6 } columnMinWidth={ 50 } columnMinHeight={ 50 } overflow="auto" { ...rest }>
            { achievements && (achievements.length > 0) && achievements.map((achievement, index) =>
                {
                    return <AchievementListItemView key={ index } achievement={ achievement } itemActive={ (selectedAchievementId === achievement.achievementId) } onClick={ event => setSelectedAchievementId(achievement.achievementId) } />;
                }) }
            { children }
        </Grid>
    );
}
