import { NitroEvent, RoomEngineTriggerWidgetEvent } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { useRoomEngineEvent } from '../../../../../hooks/events/nitro/room/room-engine-event';
import { useRoomContext } from '../../../context/RoomContext';

export const FurnitureHighScoreView: FC<{}> = props =>
{
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
    
    const onNitroEvent = (event: NitroEvent) =>
    {
        console.log(event);
    };

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_HIGH_SCORE_DISPLAY, onNitroEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_HIDE_HIGH_SCORE_DISPLAY, onNitroEvent);

    return null;
}
