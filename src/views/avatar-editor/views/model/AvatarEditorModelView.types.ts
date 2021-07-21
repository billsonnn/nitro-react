import { Dispatch, SetStateAction } from 'react';
import { IAvatarEditorCategoryModel } from '../../common/IAvatarEditorCategoryModel';

export interface AvatarEditorModelViewProps
{
    model: IAvatarEditorCategoryModel;
    gender: string;
    setGender: Dispatch<SetStateAction<string>>;
}
