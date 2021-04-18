import { RoomEngineObjectEvent, RoomEngineTriggerWidgetEvent } from 'nitro-renderer';
import { useRoomEngineEvent } from '../../../../../hooks/events/nitro/room/room-engine-event';
import { FurnitureHighScoreViewProps } from './FurnitureHighScoreView.types';

export function FurnitureHighScoreView(props: FurnitureHighScoreViewProps): JSX.Element
{
    const onRoomEngineObjectEvent = (event: RoomEngineObjectEvent) =>
    {
        console.log(event);
    };

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_HIGH_SCORE_DISPLAY, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_HIDE_HIGH_SCORE_DISPLAY, onRoomEngineObjectEvent);

    return null;
}
