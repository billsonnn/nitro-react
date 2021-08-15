import { NitroEvent, RoomEngineTriggerWidgetEvent, StringDataType } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { GetRoomEngine } from '../../../../../api';
import { useRoomEngineEvent } from '../../../../../hooks/events/nitro/room/room-engine-event';
import { LocalizeBadgeDescription } from '../../../../../utils';
import { LocalizeBadgeName } from '../../../../../utils/LocalizeBageName';
import { useRoomContext } from '../../../context/RoomContext';

export const FurnitureBadgeDisplayView: FC<{}> = props =>
{
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();

    const onNitroEvent = useCallback((event: NitroEvent) =>
    {
        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_BADGE_DISPLAY_ENGRAVING:
            case RoomEngineTriggerWidgetEvent.REQUEST_ACHIEVEMENT_RESOLUTION_ENGRAVING: {
                const widgetEvent = (event as RoomEngineTriggerWidgetEvent);

                const roomObject = GetRoomEngine().getRoomObject(widgetEvent.roomId, widgetEvent.objectId, widgetEvent.category);

                if(!roomObject) return;

                const stringStuff = new StringDataType();

                stringStuff.initializeFromRoomObjectModel(roomObject.model);

                const bagdeName = LocalizeBadgeName(stringStuff.getValue(1));
                const badgeDesc = LocalizeBadgeDescription(stringStuff.getValue(1));
                const date = stringStuff.getValue(2);
                const senderName = stringStuff.getValue(3);
                return;
            }
        }
    }, []);

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_BADGE_DISPLAY_ENGRAVING, onNitroEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_ACHIEVEMENT_RESOLUTION_ENGRAVING, onNitroEvent);

    const processAction = useCallback((type: string, value: string = null) =>
    {
        switch(type)
        {
            case 'close':
                //setTrophyData(null);
                return;
        }
    }, []);

    return null;

    // if(!trophyData) return null;

    // return <NitroLayoutTrophyView color={ trophyData.color } message={ trophyData.message } date={ trophyData.date } senderName={ trophyData.ownerName } onCloseClick={ () => processAction('close') } />;
}
