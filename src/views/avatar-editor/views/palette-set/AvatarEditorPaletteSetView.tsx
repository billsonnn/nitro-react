import { FC, useCallback } from 'react';
import { NitroCardGridView } from '../../../../layout/card/grid/NitroCardGridView';
import { AvatarEditorGridColorItem } from '../../common/AvatarEditorGridColorItem';
import { AvatarEditorPaletteSetItem } from '../palette-set-item/AvatarEditorPaletteSetItem';
import { AvatarEditorPaletteSetViewProps } from './AvatarEditorPaletteSetView.types';

export const AvatarEditorPaletteSetView: FC<AvatarEditorPaletteSetViewProps> = props =>
{
    const { model = null, category = null, paletteSet = [], paletteIndex = -1, ...rest } = props;

    const selectColor = useCallback((item: AvatarEditorGridColorItem) =>
    {
        const index = paletteSet.indexOf(item);

        if(index === -1) return;

        model.selectColor(category.name, index, paletteIndex);
    }, [ model, category, paletteSet, paletteIndex ]);

    return (
        <NitroCardGridView { ...rest }>
            { (paletteSet.length > 0) && paletteSet.map((item, index) =>
                {
                    return <AvatarEditorPaletteSetItem key={ index } colorItem={ item } onClick={ event => selectColor(item) } />;
                }) }
        </NitroCardGridView>
    );
}
