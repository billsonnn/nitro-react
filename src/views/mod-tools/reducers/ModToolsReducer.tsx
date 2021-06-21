import { Reducer } from 'react';

export interface IModToolsState
{

}

export interface IModToolsAction
{
    type: string;
    payload: {
    }
}

export class ModToolsActions
{

}

export const initialModTools: IModToolsState = {
}

export const ModToolsReducer: Reducer<IModToolsState, IModToolsAction> = (state, action) =>
{
    switch(action.type)
    {
        default:
            return state;
    }
}
