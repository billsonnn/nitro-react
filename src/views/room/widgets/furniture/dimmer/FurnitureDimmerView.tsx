import { FC, useCallback, useState } from 'react';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useRoomContext } from '../../../context/RoomContext';
import { FurnitureDimmerData } from './FurnitureDimmerData';
import { FurnitureDimmerViewProps } from './FurnitureDimmerView.types';

export const FurnitureDimmerView: FC<FurnitureDimmerViewProps> = props =>
{
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
    const [ dimmerData, setDimmerData ] = useState<FurnitureDimmerData>(null);

    // const onNitroEvent = useCallback((event: NitroEvent) =>
    // {
    //     switch(event.type)
    //     {
    //         case RoomEngineTriggerWidgetEvent.REQUEST_DIMMER: {
    //             const widgetEvent = (event as RoomEngineTriggerWidgetEvent);

    //             const roomObject = GetRoomEngine().getRoomObject(widgetEvent.roomId, widgetEvent.objectId, widgetEvent.category);
        
    //             if(!roomObject) return;

    //             const data = roomObject.model.getValue<string[]>(RoomObjectVariable.FURNITURE_DATA);

    //             console.log('data', data);
                
    //             setDimmerData(new FurnitureDimmerData(widgetEvent.objectId, widgetEvent.category, false));
    //             return;
    //         }
    //         case RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED: {
    //             const widgetEvent = (event as RoomWidgetRoomObjectUpdateEvent);

    //             setDimmerData(prevState =>
    //                 {
    //                     if(!prevState || (widgetEvent.id !== prevState.objectId) || (widgetEvent.category !== prevState.category)) return prevState;

    //                     return null;
    //                 });
    //             return;
    //         }
    //         case RoomWidgetDimmerUpdateEvent.RWDUE_PRESETS: {
    //             const widgetEvent = (event as RoomWidgetDimmerUpdateEvent);

    //             console.log(widgetEvent);
    //             return;
    //         }
    //         case RoomWidgetDimmerStateUpdateEvent.RWDSUE_DIMMER_STATE: {
    //             const widgetEvent = (event as RoomWidgetDimmerStateUpdateEvent);

    //             console.log(widgetEvent);
    //             return;
    //         }
    //     }
    // }, []);

    // useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_DIMMER, onNitroEvent);
    // CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, props.events, onNitroEvent);
    // CreateEventDispatcherHook(RoomWidgetDimmerUpdateEvent.RWDUE_PRESETS, props.events, onNitroEvent);
    // CreateEventDispatcherHook(RoomWidgetDimmerStateUpdateEvent.RWDSUE_DIMMER_STATE, props.events, onNitroEvent);

    const processAction = useCallback((type: string, value: string = null) =>
    {
        switch(type)
        {
            case 'close':
                setDimmerData(null);
                return;
        }
    }, []);

    if(!dimmerData) return null;

    return (
        <NitroCardView className="nitro-dimmer">
            <NitroCardHeaderView headerText={ LocalizeText('widget.dimmer.title') } onCloseClick={ event => processAction('close') } />
            <NitroCardContentView>
                
            </NitroCardContentView>
        </NitroCardView>
    );
}
