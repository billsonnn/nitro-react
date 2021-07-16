import { RoomEngineObjectEvent } from 'nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { CreateEventDispatcherHook } from '../../../../../hooks/events';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useRoomContext } from '../../../context/RoomContext';
import { RoomWidgetRoomObjectUpdateEvent } from '../../../events';

export const FurnitureCustomStackHeightView: FC<{}> = props =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const { roomSession = null, eventDispatcher = null } = useRoomContext();

    const close = useCallback(() =>
    {
        setObjectId(-1);
    }, []);

    const onRoomEngineObjectEvent = useCallback((event: RoomEngineObjectEvent) =>
    {
        switch(event.type)
        {
            // case RoomEngineTriggerWidgetEvent.REQUEST_CUSTOM_STACK_HEIGHT: {
            //     setObjectId(event.objectId);
            //     return;
            // }
            case RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED: {
                if(objectId !== event.objectId) return;

                close();
                return;
            }
        }
    }, [ objectId, close ]);

    //useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_CUSTOM_STACK_HEIGHT, onRoomEngineObjectEvent);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, eventDispatcher, onRoomEngineObjectEvent);

    if(objectId === -1) return null;

    return (
        <NitroCardView>
            <NitroCardHeaderView headerText={ LocalizeText('widget.backgroundcolor.title') } onCloseClick={ close } />
            <NitroCardContentView>
                custom stack height
            </NitroCardContentView>
        </NitroCardView>
    );
}
