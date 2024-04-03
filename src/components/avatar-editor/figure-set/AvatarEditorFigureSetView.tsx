import { FC } from 'react';
import { IAvatarEditorCategory, IAvatarEditorCategoryPartItem } from '../../../api';
import { InfiniteGrid } from '../../../common';
import { useAvatarEditor } from '../../../hooks';
import { AvatarEditorFigureSetItemView } from './AvatarEditorFigureSetItemView';

export const AvatarEditorFigureSetView: FC<{
    category: IAvatarEditorCategory
}> = props =>
{
    const { category = null } = props;
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
    }

    return (
        <InfiniteGrid rows={ category.partItems } columnCount={ 3 } overscan={ 5 } itemRender={ (item: IAvatarEditorCategoryPartItem) =>
        {
            if(!item) return null;

            return (
                <AvatarEditorFigureSetItemView setType={ category.setType } partItem={ item } isSelected={ isPartItemSelected(item) } onClick={ event => selectEditorPart(category.setType, item.partSet?.id ?? -1) } />
            )
        } } />
    );
}
