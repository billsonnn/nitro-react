import { NitroEvent, RoomEngineTriggerWidgetEvent, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomEngine, LocalizeText, RoomWidgetDimmerUpdateEvent, RoomWidgetRoomObjectUpdateEvent } from '../../../../../api';
import { RoomWidgetDimmerStateUpdateEvent } from '../../../../../api/nitro/room/widgets/events/RoomWidgetDimmerStateUpdateEvent';
import { RoomWidgetDimmerChangeStateMessage } from '../../../../../api/nitro/room/widgets/messages/RoomWidgetDimmerChangeStateMessage';
import { CreateEventDispatcherHook, useRoomEngineEvent } from '../../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { useRoomContext } from '../../../context/RoomContext';
import { FurnitureDimmerData } from './FurnitureDimmerData';

export const FurnitureDimmerView: FC<{}> = props =>
{
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
    const [ dimmerData, setDimmerData ] = useState<FurnitureDimmerData>(null);

    const onNitroEvent = useCallback((event: NitroEvent) =>
    {
        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_DIMMER: {
                const widgetEvent = (event as RoomEngineTriggerWidgetEvent);
                console.log(widgetEvent);
                
                const roomObject = GetRoomEngine().getRoomObject(widgetEvent.roomId, widgetEvent.objectId, widgetEvent.category);
        
                if(!roomObject) return;

                const data = roomObject.model.getValue<string[]>(RoomObjectVariable.FURNITURE_DATA);
                
                setDimmerData(new FurnitureDimmerData(widgetEvent.objectId, widgetEvent.category, false));
                return;
            }
            case RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED: {
                const widgetEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                setDimmerData(prevState =>
                    {
                        if(!prevState || (widgetEvent.id !== prevState.objectId) || (widgetEvent.category !== prevState.category)) return prevState;

                        return null;
                    });
                return;
            }
            case RoomWidgetDimmerUpdateEvent.PRESETS: {
                const widgetEvent = (event as RoomWidgetDimmerUpdateEvent);

                console.log(widgetEvent);
                return;
            }
            case RoomWidgetDimmerStateUpdateEvent.DIMMER_STATE: {
                const widgetEvent = (event as RoomWidgetDimmerStateUpdateEvent);

                console.log(widgetEvent);
                return;
            }
        }
    }, []);

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_DIMMER, onNitroEvent);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, eventDispatcher, onNitroEvent);
    CreateEventDispatcherHook(RoomWidgetDimmerUpdateEvent.PRESETS, eventDispatcher, onNitroEvent);
    CreateEventDispatcherHook(RoomWidgetDimmerStateUpdateEvent.DIMMER_STATE, eventDispatcher, onNitroEvent);

    const processAction = useCallback((type: string, value: string = null) =>
    {
        switch(type)
        {
            case 'toggle_state':
                widgetHandler.processWidgetMessage(new RoomWidgetDimmerChangeStateMessage());
                return;
            case 'close':
                setDimmerData(null);
                return;
        }
    }, [ widgetHandler ]);

    if(!dimmerData) return null;

    return (
        <NitroCardView className="nitro-dimmer" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('widget.dimmer.title') } onCloseClick={ () => processAction('close') } />
            <NitroCardContentView>
                { !dimmerData.active && <div className="d-flex flex-column gap-2 align-items-center">
                    <div className="dimmer-banner"></div>
                    <div className="bg-muted rounded p-1 text-center text-black">{ LocalizeText('widget.dimmer.info.off') }</div>
                    <button className="btn-success btn w-100" onClick={ () => processAction('toggle_state') }>{ LocalizeText('widget.dimmer.button.on') }</button>
                </div> }
            </NitroCardContentView>
        </NitroCardView>
    );
}
