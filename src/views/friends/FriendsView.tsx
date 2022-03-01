import { AcceptFriendMessageComposer, FriendListFragmentEvent, FriendListUpdateEvent, FriendParser, FriendRequestsEvent, GetFriendRequestsComposer, MessengerInitComposer, MessengerInitEvent, NewFriendRequestEvent, RequestFriendComposer, RoomEngineObjectEvent, RoomObjectCategory, RoomObjectUserType } from '@nitrots/nitro-renderer';
import { DeclineFriendMessageComposer } from '@nitrots/nitro-renderer/src';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { GetRoomSession } from '../../api';
import { FriendEnteredRoomEvent, FriendListContentEvent, FriendRequestEvent, FriendsAcceptFriendRequestEvent, FriendsDeclineFriendRequestEvent, FriendsEvent, FriendsRequestCountEvent } from '../../events';
import { FriendsSendFriendRequestEvent } from '../../events/friends/FriendsSendFriendRequestEvent';
import { CreateMessageHook, useRoomEngineEvent } from '../../hooks';
import { dispatchUiEvent, useUiEvent } from '../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../hooks/messages/message-event';
import { FriendsHelper } from './common/FriendsHelper';
import { MessengerFriend } from './common/MessengerFriend';
import { MessengerRequest } from './common/MessengerRequest';
import { MessengerSettings } from './common/MessengerSettings';
import { FriendsContextProvider } from './FriendsContext';
import { FriendBarView } from './views/friend-bar/FriendBarView';
import { FriendsListView } from './views/friends-list/FriendsListView';
import { FriendsMessengerView } from './views/messenger/FriendsMessengerView';

export const FriendsView: FC<{}> = props =>
{
    const [ isReady, setIsReady ] = useState(false);
    const [ isVisible, setIsVisible ] = useState(false);
    const [ friends, setFriends ] = useState<MessengerFriend[]>([]);
    const [ requests, setRequests ] = useState<MessengerRequest[]>([]);
    const [ settings, setSettings ] = useState<MessengerSettings>(null);
    const [ sentRequests, setSentRequests ] = useState<number[]>([]);

    const getFriend = useCallback((userId: number) =>
    {
        for(const friend of friends)
        {
            if(friend.id === userId) return friend;
        }

        return null;
    }, [ friends ]);

    FriendsHelper.getFriend = getFriend;

    const canRequestFriend = useCallback((userId: number) =>
    {
        if(getFriend(userId)) return false;

        if(sentRequests.indexOf(userId) >= 0) return false;

        return true;
    }, [ sentRequests, getFriend ]);

    FriendsHelper.canRequestFriend = canRequestFriend;

    const requestFriend = useCallback((userId: number, userName: string) =>
    {
        if(sentRequests.indexOf(userId) >= 0) return true;

        if(!canRequestFriend(userId)) return false;

        setSentRequests(prevValue =>
            {
                const newSentRequests = [ ...prevValue ];

                newSentRequests.push(userId);

                return newSentRequests;
            });

        SendMessageHook(new RequestFriendComposer(userName));
    }, [ sentRequests, canRequestFriend ]);

    const acceptFriend = useCallback((userId: number) =>
    {
        setRequests(prevValue =>
            {
                const newRequests: MessengerRequest[] = [ ...prevValue ];

                const index = newRequests.findIndex(request => (request.requesterUserId === userId));

                if(index >= 0)
                {
                    SendMessageHook(new AcceptFriendMessageComposer(newRequests[index].id));

                    dispatchUiEvent(new FriendRequestEvent(FriendRequestEvent.ACCEPTED, userId));

                    newRequests.splice(index, 1);
                }

                return newRequests;
            });
    }, []);

    const declineFriend = useCallback((userId: number, declineAll: boolean = false) =>
    {
        setRequests(prevValue =>
            {
                if(declineAll)
                {
                    SendMessageHook(new DeclineFriendMessageComposer(true));

                    for(const request of prevValue) dispatchUiEvent(new FriendRequestEvent(FriendRequestEvent.DECLINED, request.requesterUserId));

                    return [];
                }
                else
                {
                    const newRequests: MessengerRequest[] = [ ...prevValue ];

                    const index = newRequests.findIndex(request => (request.requesterUserId === userId));

                    if(index >= 0)
                    {
                        SendMessageHook(new DeclineFriendMessageComposer(false, newRequests[index].id));

                        dispatchUiEvent(new FriendRequestEvent(FriendRequestEvent.DECLINED, userId));

                        newRequests.splice(index, 1);
                    }

                    return newRequests;
                }
            });
    }, []);

    const onMessengerInitEvent = useCallback((event: MessengerInitEvent) =>
    {
        const parser = event.getParser();

        setSettings(new MessengerSettings(
            parser.userFriendLimit,
            parser.normalFriendLimit,
            parser.extendedFriendLimit,
            parser.categories));

        SendMessageHook(new GetFriendRequestsComposer());
    }, []);

    CreateMessageHook(MessengerInitEvent, onMessengerInitEvent);

    const onFriendsFragmentEvent = useCallback((event: FriendListFragmentEvent) =>
    {
        const parser = event.getParser();

        setFriends(prevValue =>
            {
                const newFriends = [ ...prevValue ];

                for(const friend of parser.fragment)
                {
                    const index = newFriends.findIndex(existingFriend => (existingFriend.id === friend.id));
                    const newFriend = new MessengerFriend();

                    newFriend.populate(friend);

                    if(index > -1) newFriends[index] = newFriend;
                    else newFriends.push(newFriend);
                }

                return newFriends;
            });
    }, []);

    CreateMessageHook(FriendListFragmentEvent, onFriendsFragmentEvent);

    const onFriendsUpdateEvent = useCallback((event: FriendListUpdateEvent) =>
    {
        const parser = event.getParser();

        setFriends(prevValue =>
            {
                const newFriends = [ ...prevValue ];

                const processUpdate = (friend: FriendParser) =>
                {
                    const index = newFriends.findIndex(existingFriend => (existingFriend.id === friend.id));

                    if(index === -1)
                    {
                        const newFriend = new MessengerFriend();
                        newFriend.populate(friend);

                        newFriends.unshift(newFriend);
                    }
                    else
                    {
                        newFriends[index].populate(friend);
                    }
                }

                for(const friend of parser.addedFriends) processUpdate(friend);

                for(const friend of parser.updatedFriends) processUpdate(friend);

                for(const removedFriendId of parser.removedFriendIds)
                {
                    const index = newFriends.findIndex(existingFriend => (existingFriend.id === removedFriendId));

                    if(index > -1) newFriends.splice(index);
                }

                return newFriends;
            });
    }, []);

    CreateMessageHook(FriendListUpdateEvent, onFriendsUpdateEvent);

    const onFriendRequestsEvent = useCallback((event: FriendRequestsEvent) =>
    {
        const parser = event.getParser();

        setRequests(prevValue =>
            {
                const newRequests = [ ...prevValue ];

                for(const request of parser.requests)
                {
                    const index = newRequests.findIndex(existing => (existing.requesterUserId === request.requesterUserId));

                    if(index > 0) continue;

                    const newRequest = new MessengerRequest();
                    newRequest.populate(request);

                    newRequests.push(newRequest);
                }

                return newRequests;
            });
    }, []);

    CreateMessageHook(FriendRequestsEvent, onFriendRequestsEvent);

    const onNewFriendRequestEvent = useCallback((event: NewFriendRequestEvent) =>
    {
        const parser = event.getParser();
        const request = parser.request;

        setRequests(prevValue =>
            {
                const newRequests = [ ...prevValue ];

                const index = newRequests.findIndex(existing => (existing.requesterUserId === request.requesterUserId));

                if(index === -1)
                {
                    const newRequest = new MessengerRequest();
                    newRequest.populate(request);

                    newRequests.push(newRequest);
                }

                return newRequests;
            });
    }, []);

    CreateMessageHook(NewFriendRequestEvent, onNewFriendRequestEvent);

    const onFriendsEvent = useCallback((event: FriendsEvent) =>
    {
        switch(event.type)
        {
            case FriendsEvent.SHOW_FRIEND_LIST:
                setIsVisible(true);
                return;
            case FriendsEvent.TOGGLE_FRIEND_LIST:
                setIsVisible(value => !value);
                return;
            case FriendsSendFriendRequestEvent.SEND_FRIEND_REQUEST:
                const requestEvent = (event as FriendsSendFriendRequestEvent);
                requestFriend(requestEvent.userId, requestEvent.userName);
                return;
            case FriendsEvent.REQUEST_FRIEND_LIST:
                dispatchUiEvent(new FriendListContentEvent(friends));
                return;
        }
    }, [ friends, requestFriend ]);

    useUiEvent(FriendsEvent.SHOW_FRIEND_LIST, onFriendsEvent);
    useUiEvent(FriendsEvent.TOGGLE_FRIEND_LIST, onFriendsEvent);
    useUiEvent(FriendsSendFriendRequestEvent.SEND_FRIEND_REQUEST, onFriendsEvent);
    useUiEvent(FriendsEvent.REQUEST_FRIEND_LIST, onFriendsEvent);

    const onFriendsAcceptFriendRequestEvent = useCallback((event: FriendsAcceptFriendRequestEvent) =>
    {
        acceptFriend(event.requestId);
    }, [ acceptFriend ]);

    useUiEvent(FriendsAcceptFriendRequestEvent.ACCEPT_FRIEND_REQUEST, onFriendsAcceptFriendRequestEvent);

    const onFriendsDeclineFriendRequestEvent = useCallback((event: FriendsDeclineFriendRequestEvent) =>
    {
        declineFriend(event.requestId);
    }, [ declineFriend ]);

    useUiEvent(FriendsDeclineFriendRequestEvent.DECLINE_FRIEND_REQUEST, onFriendsDeclineFriendRequestEvent);

    const onRoomEngineObjectEvent = useCallback((event: RoomEngineObjectEvent) =>
    {
        const roomSession = GetRoomSession();

        if(!roomSession) return;

        if(event.category !== RoomObjectCategory.UNIT) return;
        
        const userData = roomSession.userDataManager.getUserDataByIndex(event.objectId);

        if(!userData || (userData.type !== RoomObjectUserType.getTypeNumber(RoomObjectUserType.USER))) return;

        const friend = getFriend(userData.webID);

        if(!friend) return;

        dispatchUiEvent(new FriendEnteredRoomEvent(userData.roomIndex, RoomObjectCategory.UNIT, userData.webID, userData.name, userData.type));
    }, [ getFriend ]);

    useRoomEngineEvent(RoomEngineObjectEvent.ADDED, onRoomEngineObjectEvent);

    const onlineFriends = useMemo(() =>
    {
        const onlineFriends = friends.filter(friend => friend.online);

        onlineFriends.sort((a, b) =>
        {
            if( a.name < b.name ) return -1;

            if( a.name > b.name ) return 1;

            return 0;
        });

        return onlineFriends;
    }, [ friends ]);

    const offlineFriends = useMemo(() =>
    {
        const offlineFriends = friends.filter(friend => !friend.online);

        offlineFriends.sort((a, b) =>
        {
            if( a.name < b.name ) return -1;

            if( a.name > b.name ) return 1;

            return 0;
        });

        return offlineFriends;
    }, [ friends ]);

    useEffect(() =>
    {
        SendMessageHook(new MessengerInitComposer());
    }, []);

    useEffect(() =>
    {
        if(!settings) return;

        setIsReady(true);
    }, [ settings ]);

    useEffect(() =>
    {
        dispatchUiEvent(new FriendsRequestCountEvent(requests.length));
    }, [ requests ]);

    return (
        <FriendsContextProvider value={ { friends, requests, settings, canRequestFriend, requestFriend, acceptFriend, declineFriend } }>
            { isReady &&
                createPortal(<FriendBarView onlineFriends={ onlineFriends } />, document.getElementById('toolbar-friend-bar-container')) }
            { isVisible &&
                <FriendsListView onlineFriends={ onlineFriends } offlineFriends={ offlineFriends } friendRequests={ requests } onCloseClick={ () => setIsVisible(false) } /> }
            <FriendsMessengerView />
        </FriendsContextProvider>
    );
}
