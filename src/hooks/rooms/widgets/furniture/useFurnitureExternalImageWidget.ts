import { RoomEngineTriggerWidgetEvent, RoomObjectCategory, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { GetRoomEngine, IPhotoData } from '../../../../api';
import { useRoomEngineEvent } from '../../../events';
import { useFurniRemovedEvent } from '../../engine';
import { useRoom } from '../../useRoom';

const useFurnitureExternalImageWidgetState = () =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ category, setCategory ] = useState(-1);
    const [ currentPhotoIndex, setCurrentPhotoIndex ] = useState(-1);
    const [ currentPhotos, setCurrentPhotos ] = useState<IPhotoData[]>([]);
    const { roomSession = null } = useRoom();

    const onClose = () =>
    {
        setObjectId(-1);
        setCategory(-1);
        setCurrentPhotoIndex(-1);
        setCurrentPhotos([]);
    }

    useRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_EXTERNAL_IMAGE, event =>
    {
        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);
        const roomTotalImages = GetRoomEngine().getRoomObjects(roomSession?.roomId, RoomObjectCategory.WALL);

        if(!roomObject) return;

        const datas: IPhotoData[] = [];

        roomTotalImages.forEach(object =>
        {
            if (object.type !== 'external_image_wallitem_poster_small') return null;

            const data = object.model.getValue<string>(RoomObjectVariable.FURNITURE_DATA);
            const jsonData: IPhotoData = JSON.parse(data);

            datas.push(jsonData);
        });

        setObjectId(event.objectId);
        setCategory(event.category);
        setCurrentPhotos(datas);

        const roomObjectPhotoData = (JSON.parse(roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_DATA)) as IPhotoData);

        setCurrentPhotoIndex(prevValue =>
        {
            let index = 0;

            if(roomObjectPhotoData)
            {
                index = datas.findIndex(data => (data.u === roomObjectPhotoData.u))
            }

            if(index < 0) index = 0;

            return index;
        });
    });

    useFurniRemovedEvent(((objectId !== -1) && (category !== -1)), event =>
    {
        if((event.id !== objectId) || (event.category !== category)) return;

        onClose();
    });

    return { objectId, currentPhotoIndex, currentPhotos, onClose };
}

export const useFurnitureExternalImageWidget = useFurnitureExternalImageWidgetState;
