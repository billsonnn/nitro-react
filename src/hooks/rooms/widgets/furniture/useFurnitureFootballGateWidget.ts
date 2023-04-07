import { RoomEngineTriggerWidgetEvent } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { GetRoomEngine, IsOwnerOfFurniture } from '../../../../api';
import { useRoomEngineEvent } from '../../../events';
import { useFurniRemovedEvent } from '../../engine';

const useFurnitureFootballGateWidgetState = () =>
{
    const [ objectId, setObjectId ] = useState<number>(-1);
    const [ category, setCategory ] = useState<number>(-1);
    
    const onClose = () =>
    {
        setObjectId(-1);
        setCategory(-1);
    }

    useRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_CLOTHING_CHANGE, event =>
    {
        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);

        if(!roomObject || !IsOwnerOfFurniture(roomObject)) return;
        
        setObjectId(event.objectId);
        setCategory(event.category);
    });

    useFurniRemovedEvent(((objectId !== -1) && (category !== -1)), event =>
    {
        if((event.id !== objectId) || (event.category !== category)) return;

        onClose();
    });

    return { objectId, setObjectId, onClose };
}

export const useFurnitureFootballGateWidget = useFurnitureFootballGateWidgetState;
