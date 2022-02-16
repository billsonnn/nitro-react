import { Dispatch, FC, SetStateAction } from 'react';
import { AutoGrid } from '../../../../common/AutoGrid';
import { AchievementCategory } from '../../common/AchievementCategory';
import { AchievementsCategoryListItemView } from './AchievementsCategoryListItemView';

export interface AchievementsCategoryListViewProps
{
    categories: AchievementCategory[];
    selectedCategoryCode: string;
    setSelectedCategoryCode: Dispatch<SetStateAction<string>>;
}

export const AchievementsCategoryListView: FC<AchievementsCategoryListViewProps> = props =>
{
    const { categories = null, selectedCategoryCode = null, setSelectedCategoryCode = null, children = null } = props;
    
    return (
        <AutoGrid columnCount={ 3 } columnMinWidth={ 90 } columnMinHeight={ 100 }>
            { categories && (categories.length > 0) && categories.map((category, index) => <AchievementsCategoryListItemView key={ index } category={ category } itemActive={ (selectedCategoryCode === category.code) } onClick={ event => setSelectedCategoryCode(category.code) } /> ) }
            { children }
        </AutoGrid>
    );
};
