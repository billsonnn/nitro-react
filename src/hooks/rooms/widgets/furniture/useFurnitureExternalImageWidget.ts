import { RoomEngineTriggerWidgetEvent, RoomObjectCategory, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { useEffect, useState } from 'react';
import { GetRoomEngine, IPhotoData } from '../../../../api';
import { useRoomEngineEvent } from '../../../events';
import { useFurniRemovedEvent } from '../../engine';
import { useRoom } from '../../useRoom';

const useFurnitureExternalImageWidgetState = () =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ category, setCategory ] = useState(-1);
    const [ photoData, setPhotoData ] = useState([]);
    const [ photoCliked, setPhotoCliked ] = useState<IPhotoData>(null);
    const { roomSession = null } = useRoom();

    if (!roomSession) return null;

    const onClose = () =>
    {
        setObjectId(-1);
        setCategory(-1);
        setPhotoData([]);
        setPhotoCliked(null);
    }

    useEffect(() =>
    {
        setPhotoData(photoData);

    }, [ photoData ]);

    useRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_EXTERNAL_IMAGE, event =>
    {
        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);
        const roomTotalImages = GetRoomEngine().getRoomObjects(roomSession?.roomId, RoomObjectCategory.WALL);

        if(!roomObject) return;

        let imgs = [ { s: null, t: null, u: '', w: '', oi: '', o: '' } ];
        imgs.shift();

        roomTotalImages.forEach(object =>
        {
            if(object.id < 0) return null;

            if (object.type == 'external_image_wallitem_poster_small') // Photo image
            {
                const data = object.model.getValue<string>(RoomObjectVariable.FURNITURE_DATA);
                const ownerId = object.model.getValue<string>(RoomObjectVariable.FURNITURE_OWNER_ID);
                const ownerName = object.model.getValue<string>(RoomObjectVariable.FURNITURE_OWNER_NAME);
                imgs.push({ s: JSON.parse(data).s, t: JSON.parse(data).t, u: JSON.parse(data).u, w: JSON.parse(data).w, oi: ownerId, o: ownerName });
            }
        });

        const photoData = JSON.parse(JSON.stringify(imgs));
        const dataCliked = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_DATA);

        const photoDataCliked = (JSON.parse(dataCliked) as IPhotoData);

        setObjectId(event.objectId);
        setCategory(event.category);
        setPhotoData(photoData);
        setPhotoCliked(photoDataCliked);
    });

    useFurniRemovedEvent(((objectId !== -1) && (category !== -1)), event =>
    {
        if((event.id !== objectId) || (event.category !== category)) return;

        onClose();
    });

    return { objectId, photoData, photoCliked, onClose };
}

export const useFurnitureExternalImageWidget = useFurnitureExternalImageWidgetState;