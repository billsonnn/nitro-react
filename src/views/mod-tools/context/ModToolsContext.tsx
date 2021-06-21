import { createContext, FC, useContext } from 'react';
import { IModToolsContext, ModToolsContextProps } from './ModToolsContext.types';

const ModToolsContext = createContext<IModToolsContext>({
    modToolsState: null,
    dispatchModToolsState: null
});

export const ModToolsContextProvider: FC<ModToolsContextProps> = props =>
{
    return <ModToolsContext.Provider value={ props.value }>{ props.children }</ModToolsContext.Provider>
}

export const useModToolsContext = () => useContext(ModToolsContext);
