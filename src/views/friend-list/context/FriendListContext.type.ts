import { Dispatch, ProviderProps } from 'react';
import { IFriendListAction, IFriendListState } from '../reducers/FriendListReducer';

export interface IFriendListContext
{
    friendListState: IFriendListState;
    dispatchFriendListState: Dispatch<IFriendListAction>;
}

export interface FriendListContextProps extends ProviderProps<IFriendListContext>
{

}
