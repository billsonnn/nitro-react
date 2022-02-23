import { createContext, Dispatch, FC, ProviderProps, useContext } from 'react';
import { IModToolsAction, IModToolsState } from './reducers/ModToolsReducer';

export interface IModToolsContext
{
    modToolsState: IModToolsState;
    dispatchModToolsState: Dispatch<IModToolsAction>;
}

const ModToolsContext = createContext<IModToolsContext>({
    modToolsState: null,
    dispatchModToolsState: null
});

export const ModToolsContextProvider: FC<ProviderProps<IModToolsContext>> = props =>
{
    return <ModToolsContext.Provider value={ props.value }>{ props.children }</ModToolsContext.Provider>
}

export const useModToolsContext = () => useContext(ModToolsContext);
