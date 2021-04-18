import { RoomEngineObjectEvent, RoomEngineTriggerWidgetEvent } from 'nitro-renderer';
import { useRoomEngineEvent } from '../../../../../hooks/events/nitro/room/room-engine-event';
import { FurnitureMannequinViewProps } from './FurnitureMannequinView.types';

export function FurnitureMannequinView(props: FurnitureMannequinViewProps): JSX.Element
{
    const onRoomEngineObjectEvent = (event: RoomEngineObjectEvent) =>
    {
        console.log(event);
    };

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_MANNEQUIN, onRoomEngineObjectEvent);

    return null;
}
