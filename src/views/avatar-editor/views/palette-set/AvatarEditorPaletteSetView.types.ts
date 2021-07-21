import { DetailsHTMLAttributes } from 'react';
import { AvatarEditorGridColorItem } from '../../common/AvatarEditorGridColorItem';
import { CategoryData } from '../../common/CategoryData';
import { IAvatarEditorCategoryModel } from '../../common/IAvatarEditorCategoryModel';

export interface AvatarEditorPaletteSetViewProps extends DetailsHTMLAttributes<HTMLDivElement>
{
    model: IAvatarEditorCategoryModel;
    category: CategoryData;
    paletteSet: AvatarEditorGridColorItem[];
    paletteIndex: number;
}
