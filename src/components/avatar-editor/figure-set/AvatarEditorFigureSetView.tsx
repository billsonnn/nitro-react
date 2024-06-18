import { FC } from 'react';
import { IAvatarEditorCategory, IAvatarEditorCategoryPartItem } from '../../../api';
import { useAvatarEditor } from '../../../hooks';
import { InfiniteGrid } from '../../../layout';
import { AvatarEditorFigureSetItemView } from './AvatarEditorFigureSetItemView';

export const AvatarEditorFigureSetView: FC<{
    category: IAvatarEditorCategory;
    columnCount: number;
}> = props =>
{
    const { category = null, columnCount = 3 } = props;
    const { selectedParts = null, selectEditorPart } = useAvatarEditor();

    const isPartItemSelected = (partItem: IAvatarEditorCategoryPartItem) =>
    {
        if(!category || !category.setType || !selectedParts) return false;

        if(!selectedParts[category.setType])
        {
            if(partItem.isClear) return true;

            return false;
        }

        const partId = selectedParts[category.setType];

        return (partId === partItem.id);
    };

    return (
        <InfiniteGrid<IAvatarEditorCategoryPartItem> columnCount={ columnCount } itemRender={ (item: IAvatarEditorCategoryPartItem) =>
        {
            if(!item) return null;

            return (
                <AvatarEditorFigureSetItemView isSelected={ isPartItemSelected(item) } partItem={ item } setType={ category.setType } width={ `calc(100% / ${ columnCount }` } onClick={ event => selectEditorPart(category.setType, item.partSet?.id ?? -1) } />
            );
        } } items={ category.partItems } overscan={ columnCount } />
    );
};
