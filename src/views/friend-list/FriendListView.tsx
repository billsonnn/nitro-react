import { MessengerInitComposer, RoomEngineObjectEvent, RoomObjectCategory, RoomObjectUserType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { createPortal } from 'react-dom';
import { GetRoomSession, LocalizeText } from '../../api';
import { FriendEnteredRoomEvent, FriendListEvent } from '../../events';
import { FriendListContentEvent } from '../../events/friend-list/FriendListContentEvent';
import { FriendListSendFriendRequestEvent } from '../../events/friend-list/FriendListSendFriendRequestEvent';
import { useRoomEngineEvent } from '../../hooks/events';
import { dispatchUiEvent, useUiEvent } from '../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../hooks/messages/message-event';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../layout';
import { FriendListContextProvider } from './context/FriendListContext';
import { FriendListMessageHandler } from './FriendListMessageHandler';
import { FriendListViewProps } from './FriendListView.types';
import { FriendListReducer, initialFriendList } from './reducers/FriendListReducer';
import { FriendBarView } from './views/friend-bar/FriendBarView';
import { FriendListFriendsView } from './views/friends/FriendListFriendsView';

export const FriendListView: FC<FriendListViewProps> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ isReady, setIsReady ] = useState(false);
    const [ friendListState, dispatchFriendListState ] = useReducer(FriendListReducer, initialFriendList);
    const { settings = null } = friendListState;

    const onFriendListEvent = useCallback((event: FriendListEvent) =>
    {
        switch(event.type)
        {
            case FriendListEvent.SHOW_FRIEND_LIST:
                setIsVisible(true);
                return;
            case FriendListEvent.TOGGLE_FRIEND_LIST:
                setIsVisible(value => !value);
                return;
            case FriendListSendFriendRequestEvent.SEND_FRIEND_REQUEST:
                const requestEvent = (event as FriendListSendFriendRequestEvent);
                return;
            case FriendListEvent.REQUEST_FRIEND_LIST:
                console.log('requested');
                dispatchUiEvent(new FriendListContentEvent(friendListState.friends));
                return;
        }
    }, [friendListState.friends]);

    useUiEvent(FriendListEvent.SHOW_FRIEND_LIST, onFriendListEvent);
    useUiEvent(FriendListEvent.TOGGLE_FRIEND_LIST, onFriendListEvent);
    useUiEvent(FriendListSendFriendRequestEvent.SEND_FRIEND_REQUEST, onFriendListEvent);
    useUiEvent(FriendListEvent.REQUEST_FRIEND_LIST, onFriendListEvent);

    const onRoomEngineObjectEvent = useCallback((event: RoomEngineObjectEvent) =>
    {
        const roomSession = GetRoomSession();

        if(!roomSession) return;

        if(event.category !== RoomObjectCategory.UNIT) return;
        
        const userData = roomSession.userDataManager.getUserDataByIndex(event.objectId);

        if(!userData || (userData.type !== RoomObjectUserType.getTypeNumber(RoomObjectUserType.USER))) return;

        const friend = friendListState.friends.find(friend =>
            {
                return (friend.id === userData.webID);
            });

        if(!friend) return;

        dispatchUiEvent(new FriendEnteredRoomEvent(userData.roomIndex, RoomObjectCategory.UNIT, userData.webID, userData.name, userData.type));
    }, [ friendListState.friends ]);

    useRoomEngineEvent(RoomEngineObjectEvent.ADDED, onRoomEngineObjectEvent);

    useEffect(() =>
    {
        if(!settings) return;

        setIsReady(true);
    }, [ settings ]);

    useEffect(() =>
    {
        SendMessageHook(new MessengerInitComposer());
    }, []);

    return (
        <FriendListContextProvider value={ { friendListState, dispatchFriendListState } }>
            <FriendListMessageHandler />
            { isReady && createPortal(<FriendBarView />, document.getElementById('toolbar-friend-bar-container')) }
            { isVisible &&
                <NitroCardView uniqueKey="friend-list" className="nitro-friend-list">
                    <NitroCardHeaderView headerText={ LocalizeText('friendlist.friends') } onCloseClick={ event => setIsVisible(false) } />
                    <NitroCardContentView>
                        <div className="text-black fw-bold">{ LocalizeText('friendlist.search.friendscaption') }</div>
                        <FriendListFriendsView online={ true } />
                        <div className="text-black fw-bold">{ LocalizeText('friendlist.search.friendscaption') }</div>
                        <FriendListFriendsView online={ true } />
                        <div className="text-black fw-bold">{ LocalizeText('friendlist.friends.offlinecaption') }</div>
                        <FriendListFriendsView online={ false } />
                    </NitroCardContentView>
                </NitroCardView> }
        </FriendListContextProvider>
    );
}
