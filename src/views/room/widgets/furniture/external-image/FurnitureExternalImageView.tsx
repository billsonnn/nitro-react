import { FC, useCallback, useState } from 'react';
import { CreateEventDispatcherHook } from '../../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { useRoomContext } from '../../../context/RoomContext';
import { IPhotoData, RoomWidgetUpdateExternalImageEvent } from '../../../events/RoomWidgetUpdateExternalImageEvent';

export const FurnitureExternalImageView: FC<{}> = props =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [photoData, setPhotoData ] = useState<IPhotoData>(null);

    const { roomSession = null, eventDispatcher = null } = useRoomContext();
    
    const close = useCallback(() =>
    {
        setObjectId(-1);
        setPhotoData(null)
    }, []);

    const onRoomWidgetUpdateExternalImageEvent = useCallback((event: RoomWidgetUpdateExternalImageEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetUpdateExternalImageEvent.UPDATE_EXTERNAL_IMAGE: {
                setObjectId(event.objectId);
                setPhotoData(event.photoData);
            }
        }
    }, []);

    CreateEventDispatcherHook(RoomWidgetUpdateExternalImageEvent.UPDATE_EXTERNAL_IMAGE, eventDispatcher, onRoomWidgetUpdateExternalImageEvent);

    if(objectId === -1 || !photoData) return null;
    
    return(
        <NitroCardView>
            <NitroCardHeaderView headerText={ '' } onCloseClick={ close } />
            <NitroCardContentView>
                <img src={photoData.w} alt=""/>
                {photoData.m && <div>{photoData.m}</div>}
                <div>{`${photoData.n} - ${new Date(photoData.t * 1000).toLocaleDateString()}`}</div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
