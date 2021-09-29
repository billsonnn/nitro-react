import { FC, useCallback } from 'react';
import { NitroCardGridView } from '../../../../layout/card/grid/NitroCardGridView';
import { AvatarEditorGridPartItem } from '../../common/AvatarEditorGridPartItem';
import { AvatarEditorFigureSetItemView } from '../figure-set-item/AvatarEditorFigureSetItemView';
import { AvatarEditorFigureSetViewProps } from './AvatarEditorFigureSetView.types';

export const AvatarEditorFigureSetView: FC<AvatarEditorFigureSetViewProps> = props =>
{
    const { model = null, category = null, setMaxPaletteCount = null } = props;

    const selectPart = useCallback((item: AvatarEditorGridPartItem) =>
    {
        const index = category.parts.indexOf(item);

        if(index === -1) return;

        model.selectPart(category.name, index);

        const partItem = category.getCurrentPart();

        setMaxPaletteCount(partItem.maxColorIndex || 1);
    }, [ model, category, setMaxPaletteCount ]);

    return (
        <NitroCardGridView>
            { (category.parts.length > 0) && category.parts.map((item, index) =>
                {
                    return <AvatarEditorFigureSetItemView key={ index } partItem={ item } onClick={ selectPart } />;
                }) }
        </NitroCardGridView>
    );
}
