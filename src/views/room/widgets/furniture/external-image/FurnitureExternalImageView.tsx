import { FC, useCallback, useState } from 'react';
import { CreateEventDispatcherHook } from '../../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { LocalizeText } from '../../../../../utils';
import { useRoomContext } from '../../../context/RoomContext';
import { IPhotoData } from '../../../events';
import { RoomWidgetUpdateExternalImageEvent } from '../../../events/RoomWidgetUpdateExternalImageEvent';

export const FurnitureExternalImageView: FC<{}> = props =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ photoData, setPhotoData ] = useState<IPhotoData>(null);
    const { eventDispatcher = null } = useRoomContext();
    
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

    if((objectId === -1) || !photoData) return null;
    
    return(
        <NitroCardView className="nitro-external-image-widget">
            <NitroCardHeaderView headerText={ '' } onCloseClick={ close } />
            <NitroCardContentView>
                <div className="d-flex justify-content-center align-items-center picture-preview border mb-2" style={ photoData.w ? { backgroundImage: 'url(' + photoData.w + ')' } : {} }>
                    { !photoData.w &&
                        <div className="text-black fw-bold">
                            { LocalizeText('camera.loading') }
                        </div> }
                </div>
                <span className="text-center text-black">{ photoData.m && <div>{ photoData.m }</div> }</span>
                <div className="d-flex align-items-center justify-content-between">
                    <span className="text-black">{ (photoData.n || '') }</span>
                    <span className="text-black">{ new Date(photoData.t * 1000).toLocaleDateString() }</span>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
