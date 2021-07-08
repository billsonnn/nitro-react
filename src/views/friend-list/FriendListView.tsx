import { MessengerInitComposer, RoomEngineObjectEvent, RoomObjectCategory, RoomObjectUserType } from 'nitro-renderer';
import React, { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { createPortal } from 'react-dom';
import { GetRoomSession } from '../../api';
import { FriendEnteredRoomEvent, FriendListEvent } from '../../events';
import { FriendListSendFriendRequestEvent } from '../../events/friend-list/FriendListSendFriendRequestEvent';
import { useRoomEngineEvent } from '../../hooks/events';
import { dispatchUiEvent, useUiEvent } from '../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../hooks/messages/message-event';
import { NitroCardAccordionItemView, NitroCardAccordionView, NitroCardHeaderView, NitroCardView } from '../../layout';
import { LocalizeText } from '../../utils/LocalizeText';
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
        }
    }, []);

    useUiEvent(FriendListEvent.SHOW_FRIEND_LIST, onFriendListEvent);
    useUiEvent(FriendListEvent.TOGGLE_FRIEND_LIST, onFriendListEvent);
    useUiEvent(FriendListSendFriendRequestEvent.SEND_FRIEND_REQUEST, onFriendListEvent);

    useEffect(() =>
    {
        if(!settings) return;

        setIsReady(true);
    }, [ settings ]);

    useEffect(() =>
    {
        SendMessageHook(new MessengerInitComposer());
    }, []);

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

    return (
        <FriendListContextProvider value={ { friendListState, dispatchFriendListState } }>
            <FriendListMessageHandler />
            { isReady && createPortal(<FriendBarView />, document.getElementById('toolbar-friend-bar-container')) }
            { isVisible &&
                <NitroCardView className="nitro-friend-list">
                    <NitroCardHeaderView headerText={ LocalizeText('friendlist.friends') } onCloseClick={ event => setIsVisible(false) } />
                    <NitroCardAccordionView>
                        <NitroCardAccordionItemView headerText="Friends" contentClassName="ps-3">
                            <FriendListFriendsView />
                        </NitroCardAccordionItemView>
                        <NitroCardAccordionItemView headerText="Friend Requests" contentClassName="ps-3">
                            abc
                        </NitroCardAccordionItemView>
                        <NitroCardAccordionItemView headerText="Search" contentClassName="ps-3">
                            abc
                        </NitroCardAccordionItemView>
                    </NitroCardAccordionView>
                </NitroCardView> }
        </FriendListContextProvider>
    );
}
