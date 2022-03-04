import { NitroEvent, RoomEngineTriggerWidgetEvent, StringDataType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomEngine, LocalizeBadgeDescription, LocalizeBadgeName, RoomWidgetUpdateRoomObjectEvent } from '../../../../../api';
import { LayoutTrophyView } from '../../../../../common';
import { UseEventDispatcherHook, UseRoomEngineEvent } from '../../../../../hooks';
import { useRoomContext } from '../../../RoomContext';
import { FurnitureTrophyData } from '../trophy/FurnitureTrophyData';

export const FurnitureBadgeDisplayView: FC<{}> = props =>
{
    const [ trophyData, setTrophyData ] = useState<FurnitureTrophyData>(null);
    const { widgetHandler = null } = useRoomContext();

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

    UseRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_BADGE_DISPLAY_ENGRAVING, onNitroEvent);
    UseRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_ACHIEVEMENT_RESOLUTION_ENGRAVING, onNitroEvent);
    UseEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED, widgetHandler.eventDispatcher, onNitroEvent);

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

    return <LayoutTrophyView color={ trophyData.color } message={ trophyData.message } date={ trophyData.date } senderName={ trophyData.ownerName } customTitle={ trophyData.customTitle } onCloseClick={ () => processAction('close') } />;
}
