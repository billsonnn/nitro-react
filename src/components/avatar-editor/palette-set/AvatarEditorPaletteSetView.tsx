import { IPartColor } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { IAvatarEditorCategory } from '../../../api';
import { useAvatarEditor } from '../../../hooks';
import { InfiniteGrid } from '../../../layout';
import { AvatarEditorPaletteSetItem } from './AvatarEditorPaletteSetItemView';

export const AvatarEditorPaletteSetView: FC<{
    category: IAvatarEditorCategory;
    paletteIndex: number;
    columnCount: number;
}> = props =>
{
    const { category = null, paletteIndex = -1, columnCount = 3 } = props;
    const { selectedColorParts = null, selectEditorColor = null } = useAvatarEditor();

    const isPartColorSelected = (partColor: IPartColor) =>
    {
        if(!category || !category.setType || !selectedColorParts || !selectedColorParts[category.setType] || !selectedColorParts[category.setType][paletteIndex]) return false;

        const selectedColorPart = selectedColorParts[category.setType][paletteIndex];

        return (selectedColorPart.id === partColor.id);
    };

    return (
        <InfiniteGrid<IPartColor> columnCount={ columnCount } itemRender={ (item: IPartColor) =>
        {
            if(!item) return null;

            return (
                <AvatarEditorPaletteSetItem isSelected={ isPartColorSelected(item) } partColor={ item } setType={ category.setType } width={ `calc(100% / ${ columnCount }` } onClick={ event => selectEditorColor(category.setType, paletteIndex, item.id) } />
            );
        } } items={ category.colorItems[paletteIndex] } overscan={ columnCount } />
    );
};
