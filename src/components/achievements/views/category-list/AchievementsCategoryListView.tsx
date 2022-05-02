import { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react';
import { IAchievementCategory } from '../../../../api';
import { AutoGrid } from '../../../../common';
import { AchievementsCategoryListItemView } from './AchievementsCategoryListItemView';

interface AchievementsCategoryListViewProps
{
    categories: IAchievementCategory[];
    selectedCategoryCode: string;
    setSelectedCategoryCode: Dispatch<SetStateAction<string>>;
}

export const AchievementsCategoryListView: FC<PropsWithChildren<AchievementsCategoryListViewProps>> = props =>
{
    const { categories = null, selectedCategoryCode = null, setSelectedCategoryCode = null, children = null, ...rest } = props;
    
    return (
        <AutoGrid columnCount={ 3 } columnMinWidth={ 90 } columnMinHeight={ 100 } { ...rest }>
            { categories && (categories.length > 0) && categories.map((category, index) => <AchievementsCategoryListItemView key={ index } category={ category } selectedCategoryCode={ selectedCategoryCode } setSelectedCategoryCode={ setSelectedCategoryCode } /> ) }
            { children }
        </AutoGrid>
    );
};
