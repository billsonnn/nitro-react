import { Dispatch, FC, SetStateAction } from 'react';
import { IAchievementCategory } from '../../../api';
import { AutoGrid } from '../../../common';
import { AchievementsCategoryListItemView } from './AchievementsCategoryListItemView';

interface AchievementsCategoryListViewProps
{
    categories: IAchievementCategory[];
    selectedCategoryCode: string;
    setSelectedCategoryCode: Dispatch<SetStateAction<string>>;
}

export const AchievementsCategoryListView: FC<AchievementsCategoryListViewProps> = props =>
{
    const { categories = null, selectedCategoryCode = null, setSelectedCategoryCode = null } = props;

    return (
        <AutoGrid columnCount={ 3 } columnMinHeight={ 100 } columnMinWidth={ 90 }>
            { categories && (categories.length > 0) && categories.map((category, index) => <AchievementsCategoryListItemView key={ index } category={ category } selectedCategoryCode={ selectedCategoryCode } setSelectedCategoryCode={ setSelectedCategoryCode } />) }
        </AutoGrid>
    );
};
