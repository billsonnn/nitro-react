import { NitroEvent, RoomEngineTriggerWidgetEvent, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { ColorUtils, GetRoomEngine, GetRoomSession, GetSessionDataManager, RoomWidgetUpdateRoomObjectEvent } from '../../../../../api';
import { CreateEventDispatcherHook } from '../../../../../hooks/events/event-dispatcher.base';
import { useRoomEngineEvent } from '../../../../../hooks/events/nitro/room/room-engine-event';
import { DraggableWindowPosition } from '../../../../../layout';
import { DraggableWindow } from '../../../../../layout/draggable-window/DraggableWindow';
import { useRoomContext } from '../../../context/RoomContext';
import { FurnitureStickieData } from './FurnitureStickieData';
import { getStickieColorName, STICKIE_COLORS } from './FurnitureStickieUtils';

export const FurnitureStickieView: FC<{}> = props =>
{
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
    const [ stickieData, setStickieData ] = useState<FurnitureStickieData>(null);

    const onNitroEvent = useCallback((event: NitroEvent) =>
    {
        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_STICKIE: {
                const widgetEvent = (event as RoomEngineTriggerWidgetEvent);

                const roomObject = GetRoomEngine().getRoomObject(widgetEvent.roomId, widgetEvent.objectId, widgetEvent.category);

                if(!roomObject) return;
                
                const data = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_ITEMDATA);

                if(data.length < 6) return;

                let color: string   = null;
                let text: string    = null;

                if(data.indexOf(' ') > 0)
                {
                    color   = data.slice(0, data.indexOf(' '));
                    text    = data.slice((data.indexOf(' ') + 1), data.length);
                }
                else
                {
                    color = data;
                }

                setStickieData(new FurnitureStickieData(widgetEvent.objectId, widgetEvent.category, color, text, (GetRoomSession().isRoomOwner || GetSessionDataManager().isModerator), false));
                return;
            }
            case RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED: {
                const widgetEvent = (event as RoomWidgetUpdateRoomObjectEvent);

                setStickieData(prevState =>
                    {
                        if(!prevState || (widgetEvent.id !== prevState.objectId) || (widgetEvent.category !== prevState.category)) return prevState;

                        return null;
                    });
                return;
            }
        }
    }, []);

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_STICKIE, onNitroEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED, eventDispatcher, onNitroEvent);

    const processAction = useCallback((type: string, value: string = null) =>
    {
        switch(type)
        {
            case 'close':
                setStickieData(null);
                return;
            case 'trash':
                setStickieData(prevState =>
                    {
                        if(!prevState) return null;

                        GetRoomEngine().deleteRoomObject(prevState.objectId, prevState.category);

                        return null;
                    });
                return;
            case 'changeColor':
                setStickieData(prevState =>
                    {
                        const newStickieData = new FurnitureStickieData(prevState.objectId, prevState.category, value, prevState.text, prevState.canModify);

                        GetRoomEngine().modifyRoomObjectData(newStickieData.objectId, newStickieData.category, newStickieData.color, newStickieData.text);

                        return newStickieData;
                    });
                return;
            case 'changeText':
                setStickieData(prevState =>
                    {
                        const newStickieData = new FurnitureStickieData(prevState.objectId, prevState.category, prevState.color, value, prevState.canModify);

                        GetRoomEngine().modifyRoomObjectData(newStickieData.objectId, newStickieData.category, newStickieData.color, newStickieData.text);

                        return newStickieData;
                    });
                return;
            case 'editMode':
                setStickieData(prevValue =>
                    {
                        if(!prevValue.canModify) return prevValue;

                        return new FurnitureStickieData(prevValue.objectId, prevValue.category, prevValue.color, prevValue.text, prevValue.canModify, true);
                    });
                return;
        }
    }, []);

    if(!stickieData) return null;

    return (
        <DraggableWindow handleSelector=".drag-handler" position={ DraggableWindowPosition.NOTHING }>
            <div className={ 'nitro-stickie nitro-stickie-image stickie-' + getStickieColorName(stickieData.color) }>
                <div className="d-flex align-items-center stickie-header drag-handler">
                    <div className="d-flex align-items-center flex-grow-1 h-100">
                        { stickieData.canModify && 
                        <>
                            <div className="nitro-stickie-image stickie-trash header-trash" onClick={ event => processAction('trash') }></div>
                            { STICKIE_COLORS.map(color =>
                                {
                                    return <div key={ color } className="stickie-color ms-1" onClick={ event => processAction('changeColor', color) } style={ { backgroundColor: ColorUtils.makeColorHex(color) } } />
                                })}
                        </> }
                    </div>
                    <div className="d-flex align-items-center nitro-stickie-image stickie-close header-close" onClick={ event => processAction('close') }></div>
                </div>
                <div className="stickie-context">
                    { !stickieData.isEditing ? <div className="context-text" onClick={ event => processAction('editMode') }>{ stickieData.text }</div> : <textarea className="context-text" defaultValue={ stickieData.text || '' } tabIndex={ 0 } onBlur={ event => processAction('changeText', event.target.value) } autoFocus></textarea> }
                </div>
            </div>
        </DraggableWindow>
    );
}
