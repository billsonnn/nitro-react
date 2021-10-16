import { NitroEvent, RoomEngineTriggerWidgetEvent, StringDataType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomEngine, LocalizeBadgeDescription, LocalizeBadgeName, RoomWidgetUpdateRoomObjectEvent } from '../../../../../api';
import { CreateEventDispatcherHook } from '../../../../../hooks';
import { useRoomEngineEvent } from '../../../../../hooks/events/nitro/room/room-engine-event';
import { NitroLayoutTrophyView } from '../../../../../layout';
import { useRoomContext } from '../../../context/RoomContext';
import { FurnitureTrophyData } from '../trophy/FurnitureTrophyData';

export const FurnitureBadgeDisplayView: FC<{}> = props =>
{
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
    const [ trophyData, setTrophyData ] = useState<FurnitureTrophyData>(null);

    const onNitroEvent = useCallback((event: NitroEvent) =>
    {
        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_ACHIEVEMENT_RESOLUTION_ENGRAVING:
            case RoomEngineTriggerWidgetEvent.REQUEST_BADGE_DISPLAY_ENGRAVING: {
                const widgetEvent = (event as RoomEngineTriggerWidgetEvent);

                const roomObject = GetRoomEngine().getRoomObject(widgetEvent.roomId, widgetEvent.objectId, widgetEvent.category);

                if(!roomObject) return;

                const stringStuff = new StringDataType();

                stringStuff.initializeFromRoomObjectModel(roomObject.model);

                const badgeName = LocalizeBadgeName(stringStuff.getValue(1));
                const badgeDesc = LocalizeBadgeDescription(stringStuff.getValue(1));
                const date = stringStuff.getValue(2);
                const senderName = stringStuff.getValue(3);

                setTrophyData(new FurnitureTrophyData(widgetEvent.objectId, widgetEvent.category, '1', senderName, date, badgeDesc, badgeName));
                return;
            }
            case RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED: {
                const widgetEvent = (event as RoomWidgetUpdateRoomObjectEvent);

                setTrophyData(prevState =>
                    {
                        if(!prevState || (widgetEvent.id !== prevState.objectId) || (widgetEvent.category !== prevState.category)) return prevState;

                        return null;
                    });
                return;
            }
        }
    }, []);

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_BADGE_DISPLAY_ENGRAVING, onNitroEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_ACHIEVEMENT_RESOLUTION_ENGRAVING, onNitroEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED, widgetHandler.eventDispatcher, onNitroEvent);

    const processAction = useCallback((type: string, value: string = null) =>
    {
        switch(type)
        {
            case 'close':
                setTrophyData(null);
                return;
        }
    }, []);

    if(!trophyData) return null;

    return <NitroLayoutTrophyView color={ trophyData.color } message={ trophyData.message } date={ trophyData.date } senderName={ trophyData.ownerName } customTitle={ trophyData.customTitle } onCloseClick={ () => processAction('close') } />;
}
