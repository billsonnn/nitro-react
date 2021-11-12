import { NitroEvent, RoomEngineTriggerWidgetEvent, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomEngine, RoomWidgetUpdateRoomObjectEvent } from '../../../../../api';
import { CreateEventDispatcherHook } from '../../../../../hooks/events/event-dispatcher.base';
import { useRoomEngineEvent } from '../../../../../hooks/events/nitro/room/room-engine-event';
import { NitroLayoutTrophyView } from '../../../../../layout';
import { useRoomContext } from '../../../context/RoomContext';
import { FurnitureTrophyData } from './FurnitureTrophyData';

export const FurnitureTrophyView: FC<{}> = props =>
{

    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
    const [ trophyData, setTrophyData ] = useState<FurnitureTrophyData>(null);

    const onNitroEvent = useCallback((event: NitroEvent) =>
    {
        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_TROPHY: {
                const widgetEvent = (event as RoomEngineTriggerWidgetEvent);

                const roomObject = GetRoomEngine().getRoomObject(widgetEvent.roomId, widgetEvent.objectId, widgetEvent.category);

                if(!roomObject) return;
                
                let data  = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_DATA);
                let extra = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_EXTRAS);

                if(!extra) extra = '0';

                const color     = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_COLOR);
                const ownerName = data.substring(0, data.indexOf('\t'));

                data = data.substring((ownerName.length + 1), data.length);

                const trophyDate    = data.substring(0, data.indexOf('\t'));
                const trophyText    = data.substr((trophyDate.length + 1), data.length);

                setTrophyData(new FurnitureTrophyData(widgetEvent.objectId, widgetEvent.category, color, ownerName, trophyDate, trophyText));
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

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_TROPHY, onNitroEvent);
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

    return <NitroLayoutTrophyView color={ trophyData.color } message={ trophyData.message } date={ trophyData.date } senderName={ trophyData.ownerName } onCloseClick={ () => processAction('close') } />;
}
