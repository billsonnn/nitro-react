import { FriendParser } from 'nitro-renderer';
import { Reducer } from 'react';
import { MessengerFriend } from '../common/MessengerFriend';
import { MessengerSettings } from '../common/MessengerSettings';

export interface IFriendListState
{
    settings: MessengerSettings;
    friends: MessengerFriend[];
}

export interface IFriendListAction
{
    type: string;
    payload: {
        settings?: MessengerSettings;
        fragment?: FriendParser[]
    }
}

export class FriendListActions
{
    public static RESET_STATE: string = 'FLA_RESET_STATE';
    public static UPDATE_SETTINGS: string = 'FLA_UPDATE_SETTINGS';
    public static PROCESS_FRAGMENT: string = 'FLA_PROCESS_FRAGMENT';
}

export const initialFriendList: IFriendListState = {
    settings: null,
    friends: []
}

export const FriendListReducer: Reducer<IFriendListState, IFriendListAction> = (state, action) =>
{
    switch(action.type)
    {
        case FriendListActions.UPDATE_SETTINGS: {
            const settings = (action.payload.settings || state.settings || null);

            return { ...state, settings };
        }
        case FriendListActions.PROCESS_FRAGMENT: {
            const fragment = (action.payload.fragment || null);
            let friends = [ ...state.friends ];

            for(const friend of fragment)
            {
                const index = friends.findIndex(existingFriend => (existingFriend.id === friend.id));
                const newFriend = new MessengerFriend();

                newFriend.id = friend.id;
                newFriend.name = friend.name;
                newFriend.gender = friend.gender;
                newFriend.online = friend.online;
                newFriend.followingAllowed = friend.followingAllowed;
                newFriend.figure = friend.figure;
                newFriend.categoryId = friend.categoryId;
                newFriend.motto = friend.motto;
                newFriend.realName = friend.realName;
                newFriend.lastAccess = friend.lastAccess;
                newFriend.persistedMessageUser = friend.persistedMessageUser;
                newFriend.vipMember = friend.vipMember;
                newFriend.pocketHabboUser = friend.pocketHabboUser;
                newFriend.relationshipStatus = friend.relationshipStatus;

                if(index > -1) friends[index] = newFriend;
                else friends.push(newFriend);
            }

            return { ...state, friends };
        }
        default:
            return state;
    }
}
