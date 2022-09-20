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
            const ownerId = object.model.getValue<number>(RoomObjectVariable.FURNITURE_OWNER_ID);
            const ownerName = object.model.getValue<string>(RoomObjectVariable.FURNITURE_OWNER_NAME);

            datas.push({ s: JSON.parse(data).s, t: JSON.parse(data).t, u: JSON.parse(data).u, w: JSON.parse(data).w, oi: ownerId, o: ownerName });
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
