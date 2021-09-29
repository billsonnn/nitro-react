import { Dispatch, ProviderProps } from 'react';
import { IFriendsAction, IFriendsState } from '../reducers/FriendsReducer';

export interface IFriendsContext
{
    friendsState: IFriendsState;
    dispatchFriendsState: Dispatch<IFriendsAction>;
}

export interface FriendsContextProps extends ProviderProps<IFriendsContext>
{

}
