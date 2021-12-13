import { FC, useCallback } from 'react';
import { Grid } from '../../../../common/Grid';
import { AvatarEditorGridColorItem } from '../../common/AvatarEditorGridColorItem';
import { CategoryData } from '../../common/CategoryData';
import { IAvatarEditorCategoryModel } from '../../common/IAvatarEditorCategoryModel';
import { AvatarEditorPaletteSetItem } from './AvatarEditorPaletteSetItemView';

export interface AvatarEditorPaletteSetViewProps
{
    model: IAvatarEditorCategoryModel;
    category: CategoryData;
    paletteSet: AvatarEditorGridColorItem[];
    paletteIndex: number;
}

export const AvatarEditorPaletteSetView: FC<AvatarEditorPaletteSetViewProps> = props =>
{
    const { model = null, category = null, paletteSet = [], paletteIndex = -1 } = props;

    const selectColor = useCallback((item: AvatarEditorGridColorItem) =>
    {
        const index = paletteSet.indexOf(item);

        if(index === -1) return;

        model.selectColor(category.name, index, paletteIndex);
    }, [ model, category, paletteSet, paletteIndex ]);

    return (
        <Grid grow columnCount={ 3 } overflow="auto">
            { (paletteSet.length > 0) && paletteSet.map((item, index) =>
                <AvatarEditorPaletteSetItem key={ index } colorItem={ item } onClick={ event => selectColor(item) } />) }
        </Grid>
    );
}
