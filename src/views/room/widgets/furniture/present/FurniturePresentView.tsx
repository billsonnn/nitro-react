import { RoomEngineObjectEvent, RoomEngineTriggerWidgetEvent } from 'nitro-renderer';
import { FC } from 'react';
import { useRoomEngineEvent } from '../../../../../hooks/events/nitro/room/room-engine-event';
import { FurniturePresentViewProps } from './FurniturePresentView.types';

export const FurniturePresentView: FC<FurniturePresentViewProps> = props =>
{
    const onRoomEngineObjectEvent = (event: RoomEngineObjectEvent) =>
    {
        console.log(event);
    };

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_PRESENT, onRoomEngineObjectEvent);

    return null;
}
