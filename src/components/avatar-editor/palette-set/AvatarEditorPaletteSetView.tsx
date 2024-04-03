import { IPartColor } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { IAvatarEditorCategory } from '../../../api';
import { InfiniteGrid } from '../../../common';
import { useAvatarEditor } from '../../../hooks';
import { AvatarEditorPaletteSetItem } from './AvatarEditorPaletteSetItemView';

export const AvatarEditorPaletteSetView: FC<{
    category: IAvatarEditorCategory,
    paletteIndex: number;
}> = props =>
{
    const { category = null, paletteIndex = -1 } = props;
    const { selectedColorParts = null, selectEditorColor = null } = useAvatarEditor();

    const isPartColorSelected = (partColor: IPartColor) =>
    {
        if(!category || !category.setType || !selectedColorParts || !selectedColorParts[category.setType] || !selectedColorParts[category.setType][paletteIndex]) return false;

        const selectedColorPart = selectedColorParts[category.setType][paletteIndex];

        return (selectedColorPart.id === partColor.id);
    }

    return (
        <InfiniteGrid rows={ category.colorItems[paletteIndex] } columnCount={ 5 } overscan={ 5 } itemRender={ (item: IPartColor) =>
        {
            if(!item) return null;

            return (
                <AvatarEditorPaletteSetItem setType={ category.setType } partColor={ item } isSelected={ isPartColorSelected(item) } onClick={ event => selectEditorColor(category.setType, paletteIndex, item.id) } />
            )
        } } />
    );
}
