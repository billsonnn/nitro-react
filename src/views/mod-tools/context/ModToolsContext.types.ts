import { Dispatch, ProviderProps } from 'react';
import { IModToolsAction, IModToolsState } from '../reducers/ModToolsReducer';

export interface IModToolsContext
{
    modToolsState: IModToolsState;
    dispatchModToolsState: Dispatch<IModToolsAction>;
}

export interface ModToolsContextProps extends ProviderProps<IModToolsContext>
{

}
