import { Dispatch, FC, SetStateAction } from 'react';
import { IAchievementCategory } from '../../../../api';
import { AutoGrid, AutoGridProps } from '../../../../common';
import { AchievementsCategoryListItemView } from './AchievementsCategoryListItemView';

export interface AchievementsCategoryListViewProps extends AutoGridProps
{
    categories: IAchievementCategory[];
    selectedCategoryCode: string;
    setSelectedCategoryCode: Dispatch<SetStateAction<string>>;
}

export const AchievementsCategoryListView: FC<AchievementsCategoryListViewProps> = props =>
{
    const { categories = null, selectedCategoryCode = null, setSelectedCategoryCode = null, columnCount = 3, columnMinWidth = 90, columnMinHeight = 100, children = null, ...rest } = props;
    
    return (
        <AutoGrid columnCount={ columnCount } columnMinWidth={ columnMinWidth } columnMinHeight={ columnMinHeight } { ...rest }>
            { categories && (categories.length > 0) && categories.map((category, index) => <AchievementsCategoryListItemView key={ index } category={ category } itemActive={ (selectedCategoryCode === category.code) } onClick={ event => setSelectedCategoryCode(category.code) } /> ) }
            { children }
        </AutoGrid>
    );
};
