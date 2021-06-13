import { NitroEvent, RoomEngineTriggerWidgetEvent } from 'nitro-renderer';
import { FC } from 'react';
import { useRoomEngineEvent } from '../../../../../hooks/events/nitro/room/room-engine-event';
import { FurnitureHighScoreViewProps } from './FurnitureHighScoreView.types';

export const FurnitureHighScoreView: FC<FurnitureHighScoreViewProps> = props =>
{
    const onNitroEvent = (event: NitroEvent) =>
    {
        console.log(event);
    };

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_HIGH_SCORE_DISPLAY, onNitroEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_HIDE_HIGH_SCORE_DISPLAY, onNitroEvent);

    return null;
}
