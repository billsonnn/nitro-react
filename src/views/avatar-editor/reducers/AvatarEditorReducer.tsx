import { Reducer } from 'react';

export interface IAvatarEditorState
{

}

export interface IAvatarEditorAction
{
    type: string;
    payload: {
    }
}

export class AvatarEditorActions
{

}

export const initialAvatarEditor: IAvatarEditorState = {
}

export const AvatarEditorReducer: Reducer<IAvatarEditorState, IAvatarEditorAction> = (state, action) =>
{
    switch(action.type)
    {
        default:
            return state;
    }
}
