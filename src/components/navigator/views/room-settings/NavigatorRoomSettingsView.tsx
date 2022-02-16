import { RoomBannedUsersComposer, RoomBannedUsersEvent, RoomSettingsEvent, RoomUsersWithRightsComposer, RoomUsersWithRightsEvent, SaveRoomSettingsComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { CreateMessageHook, SendMessageHook } from '../../../../hooks/messages';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../../../layout';
import RoomSettingsData from '../../common/RoomSettingsData';
import { NavigatorRoomSettingsAccessTabView } from './views/NavigatorRoomSettingsAccessTabView';
import { NavigatorRoomSettingsBasicTabView } from './views/NavigatorRoomSettingsBasicTabView';
import { NavigatorRoomSettingsModTabView } from './views/NavigatorRoomSettingsModTabView';
import { NavigatorRoomSettingsRightsTabView } from './views/NavigatorRoomSettingsRightsTabView';
import { NavigatorRoomSettingsVipChatTabView } from './views/NavigatorRoomSettingsVipChatTabView';

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

    CreateMessageHook(RoomSettingsEvent, onRoomSettingsEvent);
    CreateMessageHook(RoomUsersWithRightsEvent, onRoomUsersWithRightsEvent);
    CreateMessageHook(RoomBannedUsersEvent, onRoomBannedUsersEvent);

    const saveSettings = useCallback((data: RoomSettingsData) =>
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

    const handleChange = useCallback((field: string, value: string | number | boolean) =>
    {
        const roomSettings = Object.assign({}, roomSettingsData);

        let save = true;

        switch(field)
        {
            case 'name':
                roomSettings.roomName = String(value);
                save = false;
                break;
            case 'description':
                roomSettings.roomDescription = String(value);
                save = false;
                break;
            case 'category':
                roomSettings.categoryId = Number(value);
                break;
            case 'max_visitors': 
                roomSettings.userCount = Number(value);
                break;
            case 'trade_state':
                roomSettings.tradeState =  Number(value);
                break;
            case 'allow_walkthrough':
                roomSettings.allowWalkthrough = Boolean(value);
                break;
            case 'allow_pets':
                roomSettings.allowPets = Boolean(value);
                break;
            case 'allow_pets_eat':
                roomSettings.allowPetsEat = Boolean(value);
                break;
            case 'hide_walls':
                roomSettings.hideWalls = Boolean(value);
                break;
            case 'wall_thickness':
                roomSettings.wallThickness = Number(value);
                break;
            case 'floor_thickness':
                roomSettings.floorThickness = Number(value);
                break;
            case 'lock_state':
                roomSettings.lockState = Number(value);

                if(Number(value) === 3) save = false;
                break;
            case 'password':
                roomSettings.password = String(value);
                save = false;
                break;
            case 'confirm_password':
                roomSettings.confirmPassword = String(value);
                save = false;
                break;
            case 'moderation_mute':
                roomSettings.muteState = Number(value);
                break;
            case 'moderation_kick':
                roomSettings.kickState = Number(value);
                break;
            case 'moderation_ban':
                roomSettings.banState = Number(value);
                break;
            case 'bubble_mode':
                roomSettings.chatBubbleMode = Number(value);
                break;
            case 'chat_weight':
                roomSettings.chatBubbleWeight = Number(value);
                break;
            case 'bubble_speed':
                roomSettings.chatBubbleSpeed = Number(value);
                break;
            case 'flood_protection':
                roomSettings.chatFloodProtection = Number(value);
                break;
            case 'chat_distance':
                roomSettings.chatDistance = Number(value);
                save = false;
                break;
            case 'unban_user':
                roomSettings.bannedUsers.delete(Number(value));
                save = false;
                break;
            case 'remove_rights_user':
                roomSettings.usersWithRights.delete(Number(value));
                save = false;
                break;
            case 'remove_all_rights':
                roomSettings.usersWithRights.clear();
                save = false;
                break;
            case 'save':
                save = true;
                break;
        }

        setRoomSettingsData(roomSettings);

        if(save) saveSettings(roomSettings);
    }, [ roomSettingsData, saveSettings ]);

    if(!roomSettingsData) return null;
    
    return (
        <NitroCardView uniqueKey="nitro-room-settings" className="nitro-room-settings">
            <NitroCardHeaderView headerText={ LocalizeText('navigator.roomsettings') } onCloseClick={ () => processAction('close') } />
            <NitroCardTabsView>
                { TABS.map(tab =>
                    {
                        return <NitroCardTabsItemView key={ tab } isActive={ (currentTab === tab) } onClick={ event => setCurrentTab(tab) }>{ LocalizeText(tab) }</NitroCardTabsItemView>
                    }) }
            </NitroCardTabsView>
            <NitroCardContentView>
                { currentTab === TABS[0] &&
                    <NavigatorRoomSettingsBasicTabView roomSettingsData={ roomSettingsData } handleChange={ handleChange } /> }
                { currentTab === TABS[1] &&
                    <NavigatorRoomSettingsAccessTabView roomSettingsData={ roomSettingsData } handleChange={ handleChange } /> }
                { currentTab === TABS[2] &&
                    <NavigatorRoomSettingsRightsTabView roomSettingsData= {roomSettingsData } handleChange={ handleChange } /> }
                { currentTab === TABS[3] &&
                    <NavigatorRoomSettingsVipChatTabView roomSettingsData={ roomSettingsData } handleChange={ handleChange } /> }
                { currentTab === TABS[4] &&
                    <NavigatorRoomSettingsModTabView roomSettingsData={ roomSettingsData } handleChange={ handleChange } /> }
            </NitroCardContentView>
        </NitroCardView>
    );
};
