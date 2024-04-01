import { IPartColor } from '@nitrots/nitro-renderer';
import { IAvatarEditorCategoryPartItem } from './IAvatarEditorCategoryPartItem';

export interface IAvatarEditorCategory
{
    setType: string;
    partItems: IAvatarEditorCategoryPartItem[];
    colorItems: IPartColor[][];
}
