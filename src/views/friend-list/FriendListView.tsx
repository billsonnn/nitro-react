import { MessengerInitComposer } from 'nitro-renderer';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { FriendListEvent } from '../../events';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../hooks/messages/message-event';
import { NitroCardHeaderView, NitroCardView } from '../../layout';
import { NitroCardAccordionItemView } from '../../layout/card/accordion/item/NitroCardAccordionItemView';
import { NitroCardAccordionView } from '../../layout/card/accordion/NitroCardAccordionView';
import { LocalizeText } from '../../utils/LocalizeText';
import { FriendListMessageHandler } from './FriendListMessageHandler';
import { FriendListTabs, FriendListViewProps, IFriendListContext } from './FriendListView.types';
import { FriendListFriendsView } from './friends/FriendListFriendsView';
import { MessengerSettings } from './utils/MessengerSettings';

export const FriendListContext = React.createContext<IFriendListContext>(null);

export const FriendListView: FC<FriendListViewProps> = props =>
{
    const tabs = [  FriendListTabs.FRIENDS, FriendListTabs.REQUESTS, FriendListTabs.SEARCH ];

    const [ isVisible, setIsVisible ]                   = useState(false);
    const [ currentTab, setCurrentTab ]                 = useState<string>(null);
    const [ messengerSettings, setMessengerSettings ]   = useState<MessengerSettings>(null);

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
        }
    }, []);

    useUiEvent(FriendListEvent.SHOW_FRIEND_LIST, onFriendListEvent);
    useUiEvent(FriendListEvent.TOGGLE_FRIEND_LIST, onFriendListEvent);

    useEffect(() =>
    {
        setCurrentTab(tabs[0]);
    }, [ tabs ]);

    useEffect(() =>
    {
        if(!messengerSettings) return;
    }, [ messengerSettings ]);

    useEffect(() =>
    {
        SendMessageHook(new MessengerInitComposer());
    }, []);

    return (
        <FriendListContext.Provider value={{ currentTab: currentTab, onSetCurrentTab: setCurrentTab }}>
            <FriendListMessageHandler setMessengerSettings={ setMessengerSettings }  />
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
        </FriendListContext.Provider>
    );
}
