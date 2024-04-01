import { IFigurePartSet } from '@nitrots/nitro-renderer';

export interface IAvatarEditorCategoryPartItem
{
    id?: number;
    partSet?: IFigurePartSet;
    usesColor?: boolean;
    maxPaletteCount?: number;
    isClear?: boolean;
}
