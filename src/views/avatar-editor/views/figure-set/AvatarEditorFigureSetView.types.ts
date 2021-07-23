import { Dispatch, SetStateAction } from 'react';
import { CategoryData } from '../../common/CategoryData';
import { IAvatarEditorCategoryModel } from '../../common/IAvatarEditorCategoryModel';

export interface AvatarEditorFigureSetViewProps
{
    model: IAvatarEditorCategoryModel;
    category: CategoryData;
    setMaxPaletteCount: Dispatch<SetStateAction<number>>;
}
