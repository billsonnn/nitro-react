import { Dispatch, FC, SetStateAction } from 'react';
import { Grid, GridProps } from '../../../../common/Grid';
import { AchievementCategory } from '../../common/AchievementCategory';
import { AchievementsCategoryListItemView } from './AchievementsCategoryListItemView';

export interface AchievementsCategoryListViewProps extends GridProps
{
    categories: AchievementCategory[];
    selectedCategoryCode: string;
    setSelectedCategoryCode: Dispatch<SetStateAction<string>>;
}

export const AchievementsCategoryListView: FC<AchievementsCategoryListViewProps> = props =>
{
    const { categories = null, selectedCategoryCode = null, setSelectedCategoryCode = null, children = null, ...rest } = props;
    
    return (
        <Grid grow columnMinWidth={ 90 } columnMinHeight={ 100 } { ...rest }>
            { categories && (categories.length > 0) && categories.map((category, index) => <AchievementsCategoryListItemView key={ index } category={ category } itemActive={ (selectedCategoryCode === category.code) } onClick={ event => setSelectedCategoryCode(category.code) } /> ) }
            { children }
        </Grid>
    );
};
