import { FC, useCallback, useState } from 'react';
import { IPhotoData, LocalizeText, RoomWidgetUpdateExternalImageEvent } from '../../../../../api';
import { Flex, Text } from '../../../../../common';
import { BatchUpdates, CreateEventDispatcherHook } from '../../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { useRoomContext } from '../../../context/RoomContext';

export const FurnitureExternalImageView: FC<{}> = props =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ photoData, setPhotoData ] = useState<IPhotoData>(null);
    const { eventDispatcher = null } = useRoomContext();
    
    const close = () =>
    {
        setObjectId(-1);
        setPhotoData(null)
    }

    const onRoomWidgetUpdateExternalImageEvent = useCallback((event: RoomWidgetUpdateExternalImageEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetUpdateExternalImageEvent.UPDATE_EXTERNAL_IMAGE: {

                BatchUpdates(() =>
                {
                    setObjectId(event.objectId);
                    setPhotoData(event.photoData);
                });
            }
        }
    }, []);

    CreateEventDispatcherHook(RoomWidgetUpdateExternalImageEvent.UPDATE_EXTERNAL_IMAGE, eventDispatcher, onRoomWidgetUpdateExternalImageEvent);

    if((objectId === -1) || !photoData) return null;
    
    return (
        <NitroCardView className="nitro-external-image-widget">
            <NitroCardHeaderView headerText={ '' } onCloseClick={ close } />
            <NitroCardContentView>
                <Flex center className="picture-preview border border-black" style={ photoData.w ? { backgroundImage: 'url(' + photoData.w + ')' } : {} }>
                    { !photoData.w &&
                        <Text bold>{ LocalizeText('camera.loading') }</Text> }
                </Flex>
                { photoData.m && photoData.m.length &&
                    <Text center>{ photoData.m }</Text> }
                <Flex alignItems="center" justifyContent="between">
                    <Text>{ (photoData.n || '') }</Text>
                    <Text>{ new Date(photoData.t * 1000).toLocaleDateString() }</Text>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
