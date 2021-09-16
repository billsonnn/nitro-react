import { RoomBannedUsersComposer, RoomBannedUsersEvent, RoomSettingsEvent, RoomUsersWithRightsComposer, RoomUsersWithRightsEvent, SaveRoomSettingsComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { FriendsEvent } from '../../../../events';
import { FriendListContentEvent } from '../../../../events/friends/FriendListContentEvent';
import { dispatchUiEvent, useUiEvent } from '../../../../hooks';
import { CreateMessageHook, SendMessageHook } from '../../../../hooks/messages';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../../../layout';
import RoomSettingsData from '../../common/RoomSettingsData';
import { NavigatorRoomSettingsAccessTabView } from './views/tab-access/NavigatorRoomSettingsAccessTabView';
import { NavigatorRoomSettingsBasicTabView } from './views/tab-basic/NavigatorRoomSettingsBasicTabView';
import { NavigatorRoomSettingsModTabView } from './views/tab-mod/NavigatorRoomSettingsModTabView';
import { NavigatorRoomSettingsRightsTabView } from './views/tab-rights/NavigatorRoomSettingsRightsTabView';
import { NavigatorRoomSettingsVipChatTabView } from './views/tab-vipchat/NavigatorRoomSettingsVipChatTabView';

const TABS: string[] = [
    'navigator.roomsettings.tab.1',
    'navigator.roomsettings.tab.2',
    'navigator.roomsettings.tab.3',
    'navigator.roomsettings.tab.4',
    'navigator.roomsettings.tab.5'
];

export const NavigatorRoomSettingsView: FC<{}> = props =>
{
    const [ roomSettingsData, setRoomSettingsData ] = useState<RoomSettingsData>(null);
    const [ currentTab, setCurrentTab ] = useState(TABS[0]);
    const [ friends, setFriends ] = useState<Map<number, string>>(new Map());

    const updateSettings = useCallback((roomSettings: RoomSettingsData) =>
    {
        setRoomSettingsData(roomSettings);
    }, [ setRoomSettingsData ]);

    const onRoomSettingsEvent = useCallback((event: RoomSettingsEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        setRoomSettingsData(new RoomSettingsData(parser));
        SendMessageHook(new RoomUsersWithRightsComposer(parser.roomId));
        SendMessageHook(new RoomBannedUsersComposer(parser.roomId));
    }, []);

    const onRoomUsersWithRightsEvent = useCallback((event: RoomUsersWithRightsEvent) =>
    {
        const parser = event.getParser();

        if(!parser || !roomSettingsData) return;

        if(roomSettingsData.roomId !== parser.roomId) return;

        const data = Object.assign({}, roomSettingsData);

        data.usersWithRights = new Map(parser.users);

        setRoomSettingsData(data);
    }, [roomSettingsData]);

    const onRoomBannedUsersEvent = useCallback((event: RoomBannedUsersEvent) =>
    {
        const parser = event.getParser();

        if(!parser || !roomSettingsData) return;

        if(roomSettingsData.roomId !== parser.roomId) return;

        const data = Object.assign({}, roomSettingsData);

        data.bannedUsers = new Map(parser.users);

        setRoomSettingsData(data);
    }, [roomSettingsData]);

    const onFriendsListContentEvent = useCallback((event: FriendListContentEvent) =>
    {
        if(!roomSettingsData || !event.friends) return;

        setFriends(event.friends);
    }, [roomSettingsData]);

    CreateMessageHook(RoomSettingsEvent, onRoomSettingsEvent);
    CreateMessageHook(RoomUsersWithRightsEvent, onRoomUsersWithRightsEvent);
    CreateMessageHook(RoomBannedUsersEvent, onRoomBannedUsersEvent);
    useUiEvent(FriendListContentEvent.FRIEND_LIST_CONTENT, onFriendsListContentEvent);

    useEffect(() =>
    {
        if(roomSettingsData) dispatchUiEvent(new FriendsEvent(FriendsEvent.REQUEST_FRIEND_LIST));
    }, [roomSettingsData])

    const save = useCallback((data: RoomSettingsData) =>
    {
        SendMessageHook(
            new SaveRoomSettingsComposer(
                data.roomId,
                data.roomName,
                data.roomDescription,
                data.lockState,
                data.password,
                data.userCount,
                data.categoryId,
                data.tags.length,
                data.tags,
                data.tradeState,
                data.allowPets,
                data.allowPetsEat,
                data.allowWalkthrough,
                data.hideWalls,
                data.wallThickness,
                data.floorThickness,
                data.muteState,
                data.kickState,
                data.banState,
                data.chatBubbleMode,
                data.chatBubbleWeight,
                data.chatBubbleSpeed,
                data.chatDistance,
                data.chatFloodProtection
            ));
    }, []);

    const processAction = useCallback((action: string) =>
    {
        switch(action)
        {
            case 'close':
                setRoomSettingsData(null);
                setCurrentTab(TABS[0]);
                return;
        }
    }, [ setRoomSettingsData ]);

    if(!roomSettingsData) return null;
    
    return (
        <NitroCardView className="nitro-room-settings">
            <NitroCardHeaderView headerText={ LocalizeText('navigator.roomsettings') } onCloseClick={ () => processAction('close') } />
            <NitroCardTabsView>
                { TABS.map(tab =>
                    {
                        return <NitroCardTabsItemView key={ tab } isActive={ currentTab === tab } onClick={ event => setCurrentTab(tab) }>{ LocalizeText(tab) }</NitroCardTabsItemView>
                    }) }
            </NitroCardTabsView>
            <NitroCardContentView className="text-black px-4">
                { currentTab === TABS[0] && <NavigatorRoomSettingsBasicTabView roomSettingsData={ roomSettingsData } setRoomSettingsData={ updateSettings } onSave={ save } /> }
                { currentTab === TABS[1] && <NavigatorRoomSettingsAccessTabView roomSettingsData={ roomSettingsData } setRoomSettingsData={ updateSettings } onSave={ save } /> }
                { currentTab === TABS[2] && <NavigatorRoomSettingsRightsTabView roomSettingsData= {roomSettingsData } setRoomSettingsData={ updateSettings } onSave={ save } friends={friends} /> }
                { currentTab === TABS[3] && <NavigatorRoomSettingsVipChatTabView roomSettingsData={ roomSettingsData } setRoomSettingsData={ updateSettings } onSave={ save } /> }
                { currentTab === TABS[4] && <NavigatorRoomSettingsModTabView roomSettingsData={ roomSettingsData } setRoomSettingsData={ updateSettings } onSave={ save } /> }
            </NitroCardContentView>
        </NitroCardView>
    );
};
