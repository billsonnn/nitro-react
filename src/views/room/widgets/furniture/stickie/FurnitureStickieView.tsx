import { RoomEngineObjectEvent, RoomEngineTriggerWidgetEvent } from 'nitro-renderer';
import { useState } from 'react';
import { useRoomEngineEvent } from '../../../../../hooks/events/nitro/room/room-engine-event';
import { FurnitureStickieViewProps } from './FurnitureStickieView.types';

export function FurnitureStickieView(props: FurnitureStickieViewProps): JSX.Element
{
    const [ isVisible, setIsVisible ] = useState(false);

    const onRoomEngineObjectEvent = (event: RoomEngineObjectEvent) =>
    {
        setIsVisible(true);
    };

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_STICKIE, onRoomEngineObjectEvent);

    if(!isVisible) return null;

    return (
        <div>stickie is visible</div>
    );
}
