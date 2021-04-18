import { RoomEngineObjectEvent, RoomEngineTriggerWidgetEvent } from 'nitro-renderer';
import { useRoomEngineEvent } from '../../../../../hooks/events/nitro/room/room-engine-event';
import { FurniturePresentViewProps } from './FurniturePresentView.types';

export function FurniturePresentView(props: FurniturePresentViewProps): JSX.Element
{
    const onRoomEngineObjectEvent = (event: RoomEngineObjectEvent) =>
    {
        console.log(event);
    };

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_PRESENT, onRoomEngineObjectEvent);

    return null;
}
