import { Dispatch, ProviderProps } from 'react';
import { IPurseAction, IPurseState } from '../reducers/PurseReducer';

export interface IPurseContext
{
    purseState: IPurseState;
    dispatchPurseState: Dispatch<IPurseAction>;
}

export interface PurseContextProps extends ProviderProps<IPurseContext>
{

}
