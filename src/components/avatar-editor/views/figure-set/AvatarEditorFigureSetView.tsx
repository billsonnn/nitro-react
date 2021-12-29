import { Dispatch, FC, SetStateAction, useCallback } from 'react';
import { Grid } from '../../../../common/Grid';
import { AvatarEditorGridPartItem } from '../../common/AvatarEditorGridPartItem';
import { CategoryData } from '../../common/CategoryData';
import { IAvatarEditorCategoryModel } from '../../common/IAvatarEditorCategoryModel';
import { AvatarEditorFigureSetItemView } from './AvatarEditorFigureSetItemView';

export interface AvatarEditorFigureSetViewProps
{
    model: IAvatarEditorCategoryModel;
    category: CategoryData;
    setMaxPaletteCount: Dispatch<SetStateAction<number>>;
}

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
        <Grid grow columnCount={ 3 } columnMinHeight={ 50 } overflow="auto">
            { (category.parts.length > 0) && category.parts.map((item, index) =>
                <AvatarEditorFigureSetItemView key={ index } partItem={ item } onClick={ event => selectPart(item) } />) }
        </Grid>
    );
}
