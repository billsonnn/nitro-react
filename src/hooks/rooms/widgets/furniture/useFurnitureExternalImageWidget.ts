import { RoomEngineTriggerWidgetEvent, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { GetRoomEngine, IPhotoData } from '../../../../api';
import { useRoomEngineEvent } from '../../../events';
import { useFurniRemovedEvent } from '../../engine';

const useFurnitureExternalImageWidgetState = () =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ category, setCategory ] = useState(-1);
    const [ photoData, setPhotoData ] = useState<IPhotoData>(null);

    const onClose = () =>
    {
        setObjectId(-1);
        setCategory(-1);
        setPhotoData(null);
    }

    useRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_EXTERNAL_IMAGE, event =>
    {
        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);

        if(!roomObject) return;

        const data = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_DATA);
        const photoData = (JSON.parse(data) as IPhotoData);

        setObjectId(event.objectId);
        setCategory(event.category);
        setPhotoData(photoData);
    });

    useFurniRemovedEvent(((objectId !== -1) && (category !== -1)), event =>
    {
        if((event.id !== objectId) || (event.category !== category)) return;

        onClose();
    });

    return { objectId, photoData, onClose };
}

export const useFurnitureExternalImageWidget = useFurnitureExternalImageWidgetState;
