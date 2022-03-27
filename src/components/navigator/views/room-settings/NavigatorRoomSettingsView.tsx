import { RoomBannedUsersComposer, RoomDataParser, RoomSettingsEvent, SaveRoomSettingsComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { IRoomData, LocalizeText, SendMessageComposer } from '../../../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../../../common';
import { BatchUpdates, UseMessageEventHook } from '../../../../hooks';
import { NavigatorRoomSettingsAccessTabView } from './NavigatorRoomSettingsAccessTabView';
import { NavigatorRoomSettingsBasicTabView } from './NavigatorRoomSettingsBasicTabView';
import { NavigatorRoomSettingsModTabView } from './NavigatorRoomSettingsModTabView';
import { NavigatorRoomSettingsRightsTabView } from './NavigatorRoomSettingsRightsTabView';
import { NavigatorRoomSettingsVipChatTabView } from './NavigatorRoomSettingsVipChatTabView';

const TABS: string[] = [
    'navigator.roomsettings.tab.1',
    'navigator.roomsettings.tab.2',
    'navigator.roomsettings.tab.3',
    'navigator.roomsettings.tab.4',
    'navigator.roomsettings.tab.5'
];

export const NavigatorRoomSettingsView: FC<{}> = props =>
{
    const [ roomData, setRoomData ] = useState<IRoomData>(null);
    const [ currentTab, setCurrentTab ] = useState(TABS[0]);

    const onRoomSettingsEvent = useCallback((event: RoomSettingsEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        setRoomData({
            roomId: parser.roomId,
            roomName: parser.name,
            roomDescription: parser.description,
            categoryId: parser.categoryId,
            userCount: parser.userCount,
            tags: parser.tags,
            tradeState: parser.tradeMode,
            allowWalkthrough: parser.allowWalkthrough,
            lockState: parser.state,
            password: null,
            allowPets: parser.allowPets,
            allowPetsEat: parser.allowPetsEat,
            hideWalls: parser.hideWalls,
            wallThickness: parser.thicknessWall,
            floorThickness: parser.thicknessFloor,
            chatSettings: {
                mode: parser.chatSettings.mode,
                weight: parser.chatSettings.weight,
                speed: parser.chatSettings.speed,
                distance: parser.chatSettings.distance,
                protection: parser.chatSettings.protection
            },
            moderationSettings: {
                allowMute: parser.moderationSettings.allowMute,
                allowKick: parser.moderationSettings.allowKick,
                allowBan: parser.moderationSettings.allowBan
            }
        });

        SendMessageComposer(new RoomBannedUsersComposer(parser.roomId));
    }, []);

    UseMessageEventHook(RoomSettingsEvent, onRoomSettingsEvent);

    const close = () =>
    {
        BatchUpdates(() =>
        {
            setRoomData(null);
            setCurrentTab(TABS[0]);
        });
    }

    const handleChange = (field: string, value: string | number | boolean) =>
    {
        setRoomData(prevValue =>
            {
                const newValue = { ...prevValue };

                switch(field)
                {
                    case 'name':
                        newValue.roomName = String(value);
                        break;
                    case 'description':
                        newValue.roomDescription = String(value);
                        break;
                    case 'category':
                        newValue.categoryId = Number(value);
                        break;
                    case 'max_visitors': 
                        newValue.userCount = Number(value);
                        break;
                    case 'trade_state':
                        newValue.tradeState =  Number(value);
                        break;
                    case 'allow_walkthrough':
                        newValue.allowWalkthrough = Boolean(value);
                        break;
                    case 'allow_pets':
                        newValue.allowPets = Boolean(value);
                        break;
                    case 'allow_pets_eat':
                        newValue.allowPetsEat = Boolean(value);
                        break;
                    case 'hide_walls':
                        newValue.hideWalls = Boolean(value);
                        break;
                    case 'wall_thickness':
                        newValue.wallThickness = Number(value);
                        break;
                    case 'floor_thickness':
                        newValue.floorThickness = Number(value);
                        break;
                    case 'lock_state':
                        newValue.lockState = Number(value);
                        break;
                    case 'password':
                        newValue.lockState = RoomDataParser.PASSWORD_STATE;
                        newValue.password = String(value);
                        break;
                    case 'moderation_mute':
                        newValue.moderationSettings.allowMute = Number(value);
                        break;
                    case 'moderation_kick':
                        newValue.moderationSettings.allowKick = Number(value);
                        break;
                    case 'moderation_ban':
                        newValue.moderationSettings.allowBan = Number(value);
                        break;
                    case 'bubble_mode':
                        newValue.chatSettings.mode = Number(value);
                        break;
                    case 'chat_weight':
                        newValue.chatSettings.weight = Number(value);
                        break;
                    case 'bubble_speed':
                        newValue.chatSettings.speed = Number(value);
                        break;
                    case 'flood_protection':
                        newValue.chatSettings.protection = Number(value);
                        break;
                    case 'chat_distance':
                        newValue.chatSettings.distance = Number(value);
                        break;
                }

                SendMessageComposer(
                    new SaveRoomSettingsComposer(
                        newValue.roomId,
                        newValue.roomName,
                        newValue.roomDescription,
                        newValue.lockState,
                        newValue.password,
                        newValue.userCount,
                        newValue.categoryId,
                        newValue.tags.length,
                        newValue.tags,
                        newValue.tradeState,
                        newValue.allowPets,
                        newValue.allowPetsEat,
                        newValue.allowWalkthrough,
                        newValue.hideWalls,
                        newValue.wallThickness,
                        newValue.floorThickness,
                        newValue.moderationSettings.allowMute,
                        newValue.moderationSettings.allowKick,
                        newValue.moderationSettings.allowBan,
                        newValue.chatSettings.mode,
                        newValue.chatSettings.weight,
                        newValue.chatSettings.speed,
                        newValue.chatSettings.distance,
                        newValue.chatSettings.protection
                    ));

                return newValue;
            });
    }

    if(!roomData) return null;
    
    return (
        <NitroCardView uniqueKey="nitro-room-settings" className="nitro-room-settings">
            <NitroCardHeaderView headerText={ LocalizeText('navigator.roomsettings') } onCloseClick={ close } />
            <NitroCardTabsView>
                { TABS.map(tab =>
                    {
                        return <NitroCardTabsItemView key={ tab } isActive={ (currentTab === tab) } onClick={ event => setCurrentTab(tab) }>{ LocalizeText(tab) }</NitroCardTabsItemView>
                    }) }
            </NitroCardTabsView>
            <NitroCardContentView>
                { (currentTab === TABS[0]) &&
                    <NavigatorRoomSettingsBasicTabView roomData={ roomData } handleChange={ handleChange } close={ close } /> }
                { (currentTab === TABS[1]) &&
                    <NavigatorRoomSettingsAccessTabView roomData={ roomData } handleChange={ handleChange } /> }
                { (currentTab === TABS[2]) &&
                    <NavigatorRoomSettingsRightsTabView roomData= {roomData } handleChange={ handleChange } /> }
                { (currentTab === TABS[3]) &&
                    <NavigatorRoomSettingsVipChatTabView roomData={ roomData } handleChange={ handleChange } /> }
                { (currentTab === TABS[4]) &&
                    <NavigatorRoomSettingsModTabView roomData={ roomData } handleChange={ handleChange } /> }
            </NitroCardContentView>
        </NitroCardView>
    );
};
