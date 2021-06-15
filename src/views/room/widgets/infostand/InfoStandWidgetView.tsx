import { RoomSessionUserBadgesEvent } from 'nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { FurnitureInfoData, GetObjectInfo, RentableBotInfoData, UserInfoData } from '../../../../api';
import { CreateEventDispatcherHook } from '../../../../hooks/events/event-dispatcher.base';
import { useRoomSessionManagerEvent } from '../../../../hooks/events/nitro/session/room-session-manager-event';
import { RoomWidgetRoomObjectUpdateEvent } from '../events';
import { InfoStandWidgetViewProps } from './InfoStandWidgetView.types';
import { InfoStandWidgetBotView } from './views/bot/InfoStandWidgetBotView';
import { InfoStandWidgetFurniView } from './views/furni/InfoStandWidgetFurniView';
import { InfoStandWidgetRentableBotView } from './views/rentable-bot/InfoStandWidgetRentableBotView';
import { InfoStandWidgetUserView } from './views/user/InfoStandWidgetUserView';

export const InfoStandWidgetView: FC<InfoStandWidgetViewProps> = props =>
{
    const { events = null } = props;
    const [ objectInfo, setObjectInfo ] = useState<FurnitureInfoData | UserInfoData | RentableBotInfoData>(null);

    const closeInfostand = useCallback(() =>
    {
        setObjectInfo(null);
    }, []);

    const objectSelectedHandler = useCallback((event: RoomWidgetRoomObjectUpdateEvent) =>
    {
        const objectInfo = GetObjectInfo(event.roomId, event.id, event.category);

        if(!objectInfo) return;

        setObjectInfo(objectInfo);
    }, []);

    const objectDeselectedHandler = useCallback((event: RoomWidgetRoomObjectUpdateEvent) =>
    {
        closeInfostand();
    }, [ closeInfostand ]);

    const objectRemovedHandler = useCallback((event: RoomWidgetRoomObjectUpdateEvent) =>
    {
        if(!objectInfo) return;

        let remove = false;

        switch(event.type)
        {
            case RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED:
                if(objectInfo instanceof FurnitureInfoData)
                {
                    if(objectInfo.id === event.id) remove = true;
                }
                break;
            case RoomWidgetRoomObjectUpdateEvent.USER_REMOVED:
                if(objectInfo instanceof UserInfoData)
                {
                    if(objectInfo.userRoomId === event.id) remove = true;
                }

                else if(objectInfo instanceof RentableBotInfoData)
                {
                    if(objectInfo.userRoomId === event.id) remove = true;
                }
                break;
        }

        if(remove) closeInfostand();
    }, [ objectInfo, closeInfostand ]);

    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED, events, objectSelectedHandler);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, events, objectDeselectedHandler);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, events, objectRemovedHandler);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, events, objectRemovedHandler);

    const onRoomSessionUserBadgesEvent = useCallback((event: RoomSessionUserBadgesEvent) =>
    {
        console.log(event);
    }, []);

    useRoomSessionManagerEvent(RoomSessionUserBadgesEvent.RSUBE_BADGES, onRoomSessionUserBadgesEvent);

    const getInfostandView = useCallback(() =>
    {
        if(objectInfo instanceof FurnitureInfoData)
        {
            return <InfoStandWidgetFurniView furnitureInfoData={ objectInfo }  close={ closeInfostand } />;
        }

        else if(objectInfo instanceof UserInfoData)
        {
            switch(objectInfo.type)
            {
                case UserInfoData.OWN_USER:
                case UserInfoData.PEER:
                    return <InfoStandWidgetUserView userInfoData={ objectInfo } close={ closeInfostand } />;
                case UserInfoData.BOT:
                    return <InfoStandWidgetBotView botInfoData={ objectInfo }  close={ closeInfostand } />;
            }
        }

        else if(objectInfo instanceof RentableBotInfoData)
        {
            return <InfoStandWidgetRentableBotView rentableBotInfoData={ objectInfo }  close={ closeInfostand } />;
        }

        return null;
    }, [ objectInfo, closeInfostand ]);

    if(!objectInfo) return null;

    return (
        <div className="d-flex flex-column align-items-end nitro-infostand-container">
            { getInfostandView() }
        </div>
    );
}
