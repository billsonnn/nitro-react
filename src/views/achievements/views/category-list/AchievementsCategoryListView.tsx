import { FC } from 'react';
import { NitroCardGridView } from '../../../../layout';
import { AchievementsCategoryListItemView } from '../category-list-item/AchievementsCategoryListItemView';
import { AchievementsCategoryListViewProps } from './AchievementsCategoryListView.types';

export const AchievementsCategoryListView: FC<AchievementsCategoryListViewProps> = props =>
{
    const { categories = null, selectedCategoryCode = null, setSelectedCategoryCode = null, ...rest } = props;
    
    return (
        <NitroCardGridView className="nitro-achievements-category-grid" { ...rest }>
            { categories && (categories.length > 0) && categories.map((category, index) =>
                {
                    return <AchievementsCategoryListItemView key={ index } category={ category } itemActive={ (selectedCategoryCode === category.code) } onClick={ event => setSelectedCategoryCode(category.code) } />;
                }) }
        </NitroCardGridView>
    );
};
