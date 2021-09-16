import { MessengerInitComposer, RoomEngineObjectEvent, RoomObjectCategory, RoomObjectUserType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { createPortal } from 'react-dom';
import { GetRoomSession, LocalizeText } from '../../api';
import { FriendEnteredRoomEvent, FriendListEvent } from '../../events';
import { FriendListContentEvent } from '../../events/friend-list/FriendListContentEvent';
import { FriendListSendFriendRequestEvent } from '../../events/friend-list/FriendListSendFriendRequestEvent';
import { useRoomEngineEvent } from '../../hooks/events';
import { dispatchUiEvent, useUiEvent } from '../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../hooks/messages/message-event';
import { NitroCardAccordionItemView, NitroCardAccordionView, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../layout';
import { FriendListContextProvider } from './context/FriendListContext';
import { FriendListMessageHandler } from './FriendListMessageHandler';
import { FriendListReducer, initialFriendList } from './reducers/FriendListReducer';
import { FriendBarView } from './views/friend-bar/FriendBarView';
import { FriendsListView } from './views/list/FriendsListView';

const TABS: string[] = ['friendlist.friends', 'generic.search'];

export const FriendsView: FC<{}> = props =>
{
    const [ friendListState, dispatchFriendListState ] = useReducer(FriendListReducer, initialFriendList);
    const { friends = null, requests = null, settings = null } = friendListState;

    const [ isVisible, setIsVisible ] = useState(false);
    const [ isReady, setIsReady ] = useState(false);
    const [ currentTab, setCurrentTab ] = useState<number>(0);

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

    const onlineFriends = useMemo(() =>
    {
        if(!friends) return [];

        return friends.filter(f => f.online);
    }, [ friends ]);

    const offlineFriends = useMemo(() =>
    {
        if(!friends) return [];

        return friends.filter(f => !f.online);
    }, [ friends ]);

    return (
        <FriendListContextProvider value={ { friendListState, dispatchFriendListState } }>
            <FriendListMessageHandler />
            { isReady && createPortal(<FriendBarView />, document.getElementById('toolbar-friend-bar-container')) }
            { isVisible &&
                <NitroCardView className="nitro-friend-list">
                    <NitroCardHeaderView headerText={ LocalizeText('friendlist.friends') } onCloseClick={ () => setIsVisible(false) } />
                    <NitroCardContentView className="p-0">
                        <NitroCardTabsView>
                            { TABS.map((tab, index) =>
                                {
                                    return (<NitroCardTabsItemView key={ index } isActive={ currentTab === index } onClick={ () => setCurrentTab(index) }>
                                        { LocalizeText(tab) }
                                    </NitroCardTabsItemView>);
                                }) }
                        </NitroCardTabsView>
                        <div className="text-black">
                            { currentTab === 0 && <NitroCardAccordionView>
                                <NitroCardAccordionItemView headerText={ LocalizeText('friendlist.friends') + ` (${onlineFriends.length})` } defaultState={ true }>
                                   <FriendsListView list={ onlineFriends } />
                                </NitroCardAccordionItemView>
                                <NitroCardAccordionItemView headerText={ LocalizeText('friendlist.friends.offlinecaption') + ` (${offlineFriends.length})` }>
                                    <FriendsListView list={ offlineFriends } />
                                </NitroCardAccordionItemView>
                                { requests.length > 0 && <NitroCardAccordionItemView headerText={ LocalizeText('friendlist.tab.friendrequests') + ` (${requests.length})` }>
                                    <FriendsListView list={ requests } />
                                </NitroCardAccordionItemView> }
                            </NitroCardAccordionView> }
                        </div>
                    </NitroCardContentView>
                </NitroCardView> }
        </FriendListContextProvider>
    );
}
