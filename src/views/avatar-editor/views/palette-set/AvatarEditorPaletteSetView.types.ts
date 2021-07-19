import { AvatarEditorGridColorItem } from '../../common/AvatarEditorGridColorItem';
import { CategoryData } from '../../common/CategoryData';
import { IAvatarEditorCategoryModel } from '../../common/IAvatarEditorCategoryModel';

export interface AvatarEditorPaletteSetViewProps
{
    model: IAvatarEditorCategoryModel;
    category: CategoryData;
    paletteSet: AvatarEditorGridColorItem[];
    paletteIndex: number;
}
