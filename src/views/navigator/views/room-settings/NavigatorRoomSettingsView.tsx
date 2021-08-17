import { RoomSettingsEvent, SaveRoomSettingsComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { CreateMessageHook, SendMessageHook } from '../../../../hooks/messages';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../../../layout';
import RoomSettingsData from '../../common/RoomSettingsData';
import { NavigatorRoomSettingsAccessTabView } from './views/tab-access/NavigatorRoomSettingsAccessTabView';
import { NavigatorRoomSettingsBasicTabView } from './views/tab-basic/NavigatorRoomSettingsBasicTabView';

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
        console.log('update', roomSettings);
        setRoomSettingsData(roomSettings);
    }, [ setRoomSettingsData ]);

    const onRoomSettingsEvent = useCallback((event: RoomSettingsEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        setRoomSettingsData(new RoomSettingsData(parser));
    }, []);
    
    CreateMessageHook(RoomSettingsEvent, onRoomSettingsEvent);

    const save = useCallback(() =>
    {
        SendMessageHook(
            new SaveRoomSettingsComposer(
                roomSettingsData.roomId,
                roomSettingsData.roomName,
                roomSettingsData.roomDescription,
                roomSettingsData.lockState,
                roomSettingsData.password,
                roomSettingsData.userCount,
                roomSettingsData.categoryId,
                roomSettingsData.tags.length,
                roomSettingsData.tags,
                roomSettingsData.tradeState,
                roomSettingsData.allowPets,
                roomSettingsData.allowPetsEat,
                roomSettingsData.allowWalkthrough,
                roomSettingsData.hideWalls,
                roomSettingsData.wallThickness,
                roomSettingsData.floorThickness,
                roomSettingsData.muteState,
                roomSettingsData.kickState,
                roomSettingsData.banState,
                roomSettingsData.chatBubbleMode,
                roomSettingsData.chatBubbleWeight,
                roomSettingsData.chatBubbleSpeed,
                roomSettingsData.chatDistance,
                roomSettingsData.chatFloodProtection
            ));
    }, [ roomSettingsData ]);

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
            </NitroCardContentView>
        </NitroCardView>
    );
};
