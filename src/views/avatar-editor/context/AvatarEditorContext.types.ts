import { Dispatch, ProviderProps } from 'react';
import { IAvatarEditorAction, IAvatarEditorState } from '../reducers/AvatarEditorReducer';

export interface IAvatarEditorContext
{
    avatarEditorState: IAvatarEditorState;
    dispatchAvatarEditorState: Dispatch<IAvatarEditorAction>;
}

export interface AvatarEditorContextProps extends ProviderProps<IAvatarEditorContext>
{

}
