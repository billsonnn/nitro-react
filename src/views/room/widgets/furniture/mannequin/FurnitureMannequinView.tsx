import { RoomEngineObjectEvent, RoomEngineTriggerWidgetEvent } from 'nitro-renderer';
import { FC } from 'react';
import { useRoomEngineEvent } from '../../../../../hooks/events/nitro/room/room-engine-event';
import { FurnitureMannequinViewProps } from './FurnitureMannequinView.types';

export const FurnitureMannequinView: FC<FurnitureMannequinViewProps> = props =>
{
    const onRoomEngineObjectEvent = (event: RoomEngineObjectEvent) =>
    {
        console.log(event);
    };

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_MANNEQUIN, onRoomEngineObjectEvent);

    return null;
}
