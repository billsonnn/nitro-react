import { createContext, FC, useContext } from 'react';
import { AvatarEditorContextProps, IAvatarEditorContext } from './AvatarEditorContext.types';

const AvatarEditorContext = createContext<IAvatarEditorContext>({
    avatarEditorState: null,
    dispatchAvatarEditorState: null
});

export const AvatarEditorContextProvider: FC<AvatarEditorContextProps> = props =>
{
    return <AvatarEditorContext.Provider value={ props.value }>{ props.children }</AvatarEditorContext.Provider>
}

export const useAvatarEditorContext = () => useContext(AvatarEditorContext);
