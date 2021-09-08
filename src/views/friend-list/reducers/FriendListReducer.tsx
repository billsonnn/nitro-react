import { FriendListUpdateParser, FriendParser, FriendRequestData } from '@nitrots/nitro-renderer';
import { Reducer } from 'react';
import { MessengerFriend } from '../common/MessengerFriend';
import { MessengerRequest } from '../common/MessengerRequest';
import { MessengerSettings } from '../common/MessengerSettings';

function compareName(a, b)
{
    if( a.name < b.name ) return -1;
    if( a.name > b.name ) return 1;
    return 0;
}

export interface IFriendListState
{
    settings: MessengerSettings;
    friends: MessengerFriend[];
    requests: MessengerRequest[];
}

export interface IFriendListAction
{
    type: string;
    payload: {
        settings?: MessengerSettings;
        fragment?: FriendParser[];
        update?: FriendListUpdateParser;
        requests?: FriendRequestData[];
    }
}

export class FriendListActions
{
    public static RESET_STATE: string = 'FLA_RESET_STATE';
    public static UPDATE_SETTINGS: string = 'FLA_UPDATE_SETTINGS';
    public static PROCESS_FRAGMENT: string = 'FLA_PROCESS_FRAGMENT';
    public static PROCESS_UPDATE: string = 'FLA_PROCESS_UPDATE';
    public static PROCESS_REQUESTS: string = 'FLA_PROCESS_REQUESTS';
}

export const initialFriendList: IFriendListState = {
    settings: null,
    friends: [],
    requests: []
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

            friends.sort(compareName);

            return { ...state, friends };
        }
        case FriendListActions.PROCESS_UPDATE: {
            const update = (action.payload.update || null);
            let friends = [ ...state.friends ];

            if(update)
            {
                const processUpdate = (friend: FriendParser) =>
                {
                    const index = friends.findIndex(existingFriend => (existingFriend.id === friend.id));

                    const newFriend = new MessengerFriend();
                    newFriend.populate(friend);

                    if(index > -1) friends[index] = newFriend;
                    else friends.unshift(newFriend);
                }

                for(const friend of update.addedFriends) processUpdate(friend);

                for(const friend of update.updatedFriends) processUpdate(friend);

                for(const removedFriendId of update.removedFriendIds)
                {
                    const index = friends.findIndex(existingFriend => (existingFriend.id === removedFriendId));

                    if(index > -1) friends.splice(index);
                }
            }
            
            friends.sort(compareName);

            return { ...state, friends };
        }
        case FriendListActions.PROCESS_REQUESTS: {
            const newRequests = (action.payload.requests || null);
            let requests = [ ...state.requests ];

            for(const request of newRequests)
            {
                const newRequest = new MessengerRequest();
                newRequest.populate(request);
                requests.push(newRequest);
            }

            requests.sort(compareName);

            return { ...state, requests };
        }
        default:
            return state;
    }
}
