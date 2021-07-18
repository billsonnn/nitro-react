import { FC, useCallback } from 'react';
import { NitroCardGridView } from '../../../../layout/card/grid/NitroCardGridView';
import { AvatarEditorGridPartItem } from '../../common/AvatarEditorGridPartItem';
import { AvatarEditorFigureSetItemView } from '../figure-set-item/AvatarEditorFigureSetItemView';
import { AvatarEditorFigureSetViewProps } from './AvatarEditorFigureSetView.types';

export const AvatarEditorFigureSetView: FC<AvatarEditorFigureSetViewProps> = props =>
{
    const { model = null, category = null } = props;

    const selectPart = useCallback((part: AvatarEditorGridPartItem) =>
    {
        const index = category.parts.indexOf(part);

        if(index === -1) return;

        model.selectPart(category.name, index);
    }, [ model, category ]);

    return (
        <NitroCardGridView columns={ 3 }>
            { (category.parts.length > 0) && category.parts.map((item, index) =>
                {
                    return <AvatarEditorFigureSetItemView key={ index } partItem={ item } onClick={ selectPart } />;
                }) }
        </NitroCardGridView>
    )
}
