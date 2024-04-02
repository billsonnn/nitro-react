import { IPartColor } from '@nitrots/nitro-renderer';
import { FC, useRef } from 'react';
import { IAvatarEditorCategory } from '../../../../api';
import { AutoGrid } from '../../../../common';
import { useAvatarEditor } from '../../../../hooks';
import { AvatarEditorPaletteSetItem } from './AvatarEditorPaletteSetItemView';

export const AvatarEditorPaletteSetView: FC<{
    category: IAvatarEditorCategory,
    paletteIndex: number;
}> = props =>
{
    const { category = null, paletteIndex = -1 } = props;
    const paletteSet = category?.colorItems[paletteIndex] ?? null;
    const { selectedColors = null, selectEditorColor } = useAvatarEditor();
    const elementRef = useRef<HTMLDivElement>(null);

    const isPartColorSelected = (partColor: IPartColor) =>
    {
        if(!category || !category.setType || !selectedColors || !selectedColors[category.setType] || !selectedColors[category.setType][paletteIndex]) return false;

        const colorId = selectedColors[category.setType][paletteIndex];

        return (colorId === partColor.id);
    }

    return (
        <AutoGrid innerRef={ elementRef } gap={ 1 } columnCount={ 5 } columnMinWidth={ 30 }>
            { (paletteSet.length > 0) && paletteSet.map(item =>
                <AvatarEditorPaletteSetItem key={ item.id } setType={ category.setType } partColor={ item } isSelected={ isPartColorSelected(item) } onClick={ event => selectEditorColor(category.setType, paletteIndex, item.id) } />) }
        </AutoGrid>
    );
}
