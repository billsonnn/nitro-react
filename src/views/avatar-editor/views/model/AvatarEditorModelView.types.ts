import { AvatarEditor } from '../../common/AvatarEditor';
import { IAvatarEditorCategoryModel } from '../../common/IAvatarEditorCategoryModel';

export interface AvatarEditorModelViewProps
{
    model: IAvatarEditorCategoryModel;
    editor: AvatarEditor;
    selectGender: (gender: string) => void;
}
