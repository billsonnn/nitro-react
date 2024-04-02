import { FC, useRef } from 'react';
import { IAvatarEditorCategory, IAvatarEditorCategoryPartItem } from '../../../../api';
import { InfiniteGrid } from '../../../../common';
import { useAvatarEditor } from '../../../../hooks';
import { AvatarEditorFigureSetItemView } from './AvatarEditorFigureSetItemView';

export const AvatarEditorFigureSetView: FC<{
    category: IAvatarEditorCategory
}> = props =>
{
    const { category = null } = props;
    const { selectedParts = null, selectEditorPart } = useAvatarEditor();
    const elementRef = useRef<HTMLDivElement>(null);

    const isPartItemSelected = (partItem: IAvatarEditorCategoryPartItem) =>
    {
        if(!category || !category.setType || !selectedParts || !selectedParts[category.setType]) return false;

        const partId = selectedParts[category.setType];

        return (partId === partItem.id);
    }

    const columnCount = 3;

    return (
        <InfiniteGrid rows={ category.partItems } columnCount={ columnCount } overscan={ 5 } itemRender={ (item: IAvatarEditorCategoryPartItem) =>
        {
            if(!item) return null;

            return (
                <AvatarEditorFigureSetItemView key={ item.id } setType={ category.setType } partItem={ item } isSelected={ isPartItemSelected(item) } onClick={ event => selectEditorPart(category.setType, item.partSet?.id ?? -1) } />
            )
        } } />
    );
}
