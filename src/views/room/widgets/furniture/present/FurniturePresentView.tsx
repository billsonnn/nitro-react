import { NitroEvent, RoomEngineTriggerWidgetEvent } from 'nitro-renderer';
import { FC } from 'react';
import { useRoomEngineEvent } from '../../../../../hooks/events/nitro/room/room-engine-event';
import { useRoomContext } from '../../../context/RoomContext';

export const FurniturePresentView: FC<{}> = props =>
{
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
    
    const onNitroEvent = (event: NitroEvent) =>
    {
        console.log(event);
    };

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_PRESENT, onNitroEvent);

    return null;
}
