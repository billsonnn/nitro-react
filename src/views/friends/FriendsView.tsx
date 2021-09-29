import { MessengerInitComposer, RoomEngineObjectEvent, RoomObjectCategory, RoomObjectUserType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { createPortal } from 'react-dom';
import { GetRoomSession } from '../../api';
import { FriendEnteredRoomEvent, FriendListContentEvent, FriendsEvent } from '../../events';
import { FriendsSendFriendRequestEvent } from '../../events/friends/FriendsSendFriendRequestEvent';
import { useRoomEngineEvent } from '../../hooks/events';
import { dispatchUiEvent, useUiEvent } from '../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../hooks/messages/message-event';
import { FriendsContextProvider } from './context/FriendsContext';
import { FriendsMessageHandler } from './FriendsMessageHandler';
import { FriendsReducer, initialFriends } from './reducers/FriendsReducer';
import { FriendBarView } from './views/friend-bar/FriendBarView';
import { FriendsListView } from './views/friends-list/FriendsListView';
import { FriendsMessengerView } from './views/messenger/FriendsMessengerView';

export const FriendsView: FC<{}> = props =>
{
    const [ friendsState, dispatchFriendsState ] = useReducer(FriendsReducer, initialFriends);
    const { friends = [], requests = [], settings = null } = friendsState;

    const [ isReady, setIsReady ] = useState(false);
    const [ isListVisible, setIsListVisible ] = useState(false);

    useEffect(() =>
    {
        SendMessageHook(new MessengerInitComposer());
    }, []);

    useEffect(() =>
    {
        if(!settings) return;

        setIsReady(true);
    }, [ settings ]);

    const onFriendsEvent = useCallback((event: FriendsEvent) =>
    {
        switch(event.type)
        {
            case FriendsEvent.SHOW_FRIEND_LIST:
                setIsListVisible(true);
                return;
            case FriendsEvent.TOGGLE_FRIEND_LIST:
                setIsListVisible(value => !value);
                return;
            case FriendsSendFriendRequestEvent.SEND_FRIEND_REQUEST:
                const requestEvent = (event as FriendsSendFriendRequestEvent);
                return;
            case FriendsEvent.REQUEST_FRIEND_LIST:
                dispatchUiEvent(new FriendListContentEvent(friendsState.friends));
                return;
        }
    }, [ friendsState.friends ]);

    useUiEvent(FriendsEvent.SHOW_FRIEND_LIST, onFriendsEvent);
    useUiEvent(FriendsEvent.TOGGLE_FRIEND_LIST, onFriendsEvent);
    useUiEvent(FriendsSendFriendRequestEvent.SEND_FRIEND_REQUEST, onFriendsEvent);
    useUiEvent(FriendsEvent.REQUEST_FRIEND_LIST, onFriendsEvent);

    const onRoomEngineObjectEvent = useCallback((event: RoomEngineObjectEvent) =>
    {
        const roomSession = GetRoomSession();

        if(!roomSession) return;

        if(event.category !== RoomObjectCategory.UNIT) return;
        
        const userData = roomSession.userDataManager.getUserDataByIndex(event.objectId);

        if(!userData || (userData.type !== RoomObjectUserType.getTypeNumber(RoomObjectUserType.USER))) return;

        const friend = friendsState.friends.find(friend =>
            {
                return (friend.id === userData.webID);
            });

        if(!friend) return;

        dispatchUiEvent(new FriendEnteredRoomEvent(userData.roomIndex, RoomObjectCategory.UNIT, userData.webID, userData.name, userData.type));
    }, [ friendsState.friends ]);

    useRoomEngineEvent(RoomEngineObjectEvent.ADDED, onRoomEngineObjectEvent);

    const onlineFriends = useMemo(() =>
    {
        return friends.filter(f => f.online);
    }, [ friends ]);

    const offlineFriends = useMemo(() =>
    {
        return friends.filter(f => !f.online);
    }, [ friends ]);

    return (
        <FriendsContextProvider value={ { friendsState, dispatchFriendsState } }>
            <FriendsMessageHandler />
            { isReady && createPortal(<FriendBarView onlineFriends={ onlineFriends } />, document.getElementById('toolbar-friend-bar-container')) }
            { isListVisible && <FriendsListView onlineFriends={ onlineFriends } offlineFriends={ offlineFriends } friendRequests={ requests } onCloseClick={ () => setIsListVisible(false) } /> }
            <FriendsMessengerView />
        </FriendsContextProvider>
    );
}
