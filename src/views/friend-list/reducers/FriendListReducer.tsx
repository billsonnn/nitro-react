import { Reducer } from 'react';
import { MessengerSettings } from '../utils/MessengerSettings';

export interface IFriendListState
{
    settings: MessengerSettings
}

export interface IFriendListAction
{
    type: string;
    payload: {
        settings?: MessengerSettings
    }
}

export class FriendListActions
{
    public static RESET_STATE: string = 'FLA_RESET_STATE';
    public static UPDATE_SETTINGS: string = 'FLA_UPDATE_SETTINGS';
}

export const initialFriendList: IFriendListState = {
    settings: null
}

export const FriendListReducer: Reducer<IFriendListState, IFriendListAction> = (state, action) =>
{
    switch(action.type)
    {
        case FriendListActions.UPDATE_SETTINGS: {
            const settings = (action.payload.settings || state.settings || null);

            return { ...state, settings };
        }
        default:
            return state;
    }
}
