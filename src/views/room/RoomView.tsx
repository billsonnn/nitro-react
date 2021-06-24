import { EventDispatcher, Nitro, RoomEngineEvent, RoomEngineObjectEvent, RoomGeometry, RoomId, RoomObjectCategory, RoomObjectOperationType, RoomVariableEnum, Vector3d } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CanManipulateFurniture, IsFurnitureSelectionDisabled, ProcessRoomObjectOperation } from '../../api';
import { DispatchMouseEvent } from '../../api/nitro/room/DispatchMouseEvent';
import { WindowResizeEvent } from '../../api/nitro/room/DispatchResizeEvent';
import { DispatchTouchEvent } from '../../api/nitro/room/DispatchTouchEvent';
import { GetRoomEngine } from '../../api/nitro/room/GetRoomEngine';
import { useRoomEngineEvent } from '../../hooks/events';
import { RoomContextProvider } from './context/RoomContext';
import { RoomWidgetRoomEngineUpdateEvent, RoomWidgetRoomObjectUpdateEvent } from './events';
import { IRoomWidgetHandlerManager, RoomWidgetAvatarInfoHandler, RoomWidgetHandlerManager, RoomWidgetInfostandHandler } from './handlers';
import { RoomViewProps } from './RoomView.types';
import { RoomWidgetsView } from './widgets/RoomWidgetsView';

export const RoomView: FC<RoomViewProps> = props =>
{
    const { roomSession = null } = props;
    const [ roomCanvas, setRoomCanvas ] = useState<HTMLCanvasElement>(null);
    const [ widgetHandler, setWidgetHandler ] = useState<IRoomWidgetHandlerManager>(null);

    useEffect(() =>
    {
        if(!roomSession)
        {
            window.onresize = null;

            setRoomCanvas(null);
            setWidgetHandler(null);

            return;
        }

        const widgetHandlerManager = new RoomWidgetHandlerManager(roomSession, new EventDispatcher());

        widgetHandlerManager.registerHandler(new RoomWidgetAvatarInfoHandler());
        widgetHandlerManager.registerHandler(new RoomWidgetInfostandHandler());

        setWidgetHandler(widgetHandlerManager);

        Nitro.instance.renderer.resize(window.innerWidth, window.innerHeight);

        const canvasId = 1;
        
        const displayObject = GetRoomEngine().getRoomInstanceDisplay(roomSession.roomId, canvasId, Nitro.instance.width, Nitro.instance.height, RoomGeometry.SCALE_ZOOMED_IN);

        if(!displayObject) return;

        const geometry = (GetRoomEngine().getRoomInstanceGeometry(roomSession.roomId, canvasId) as RoomGeometry);

        if(geometry)
        {
            const minX = (GetRoomEngine().getRoomInstanceVariable<number>(roomSession.roomId, RoomVariableEnum.ROOM_MIN_X) || 0);
            const maxX = (GetRoomEngine().getRoomInstanceVariable<number>(roomSession.roomId, RoomVariableEnum.ROOM_MAX_X) || 0);
            const minY = (GetRoomEngine().getRoomInstanceVariable<number>(roomSession.roomId, RoomVariableEnum.ROOM_MIN_Y) || 0);
            const maxY = (GetRoomEngine().getRoomInstanceVariable<number>(roomSession.roomId, RoomVariableEnum.ROOM_MAX_Y) || 0);

            let x = ((minX + maxX) / 2);
            let y = ((minY + maxY) / 2);

            const offset = 20;

            x = (x + (offset - 1));
            y = (y + (offset - 1));

            const z = (Math.sqrt(((offset * offset) + (offset * offset))) * Math.tan(((30 / 180) * Math.PI)));

            geometry.location = new Vector3d(x, y, z);
        }

        const stage = Nitro.instance.stage;

        if(!stage) return;

        stage.addChild(displayObject);

        const canvas = Nitro.instance.renderer.view;

        if(!canvas) return;

        canvas.onclick          = event => DispatchMouseEvent(roomSession.roomId, canvasId, event);
        canvas.onmousemove      = event => DispatchMouseEvent(roomSession.roomId, canvasId, event);
        canvas.onmousedown      = event => DispatchMouseEvent(roomSession.roomId, canvasId, event);
        canvas.onmouseup        = event => DispatchMouseEvent(roomSession.roomId, canvasId, event);

        canvas.ontouchstart     = event => DispatchTouchEvent(roomSession.roomId, canvasId, event);
        canvas.ontouchmove      = event => DispatchTouchEvent(roomSession.roomId, canvasId, event);
        canvas.ontouchend       = event => DispatchTouchEvent(roomSession.roomId, canvasId, event);
        canvas.ontouchcancel    = event => DispatchTouchEvent(roomSession.roomId, canvasId, event);

        window.onresize = event => WindowResizeEvent(roomSession.roomId, canvasId);

        setRoomCanvas(canvas);
    }, [ roomSession ]);

    const onRoomEngineEvent = useCallback((event: RoomEngineEvent) =>
    {
        if(!widgetHandler || RoomId.isRoomPreviewerId(event.roomId)) return;

        switch(event.type)
        {
            case RoomEngineEvent.NORMAL_MODE:
                widgetHandler.eventDispatcher.dispatchEvent(new RoomWidgetRoomEngineUpdateEvent(RoomWidgetRoomEngineUpdateEvent.NORMAL_MODE, event.roomId));
                return;
            case RoomEngineEvent.GAME_MODE:
                widgetHandler.eventDispatcher.dispatchEvent(new RoomWidgetRoomEngineUpdateEvent(RoomWidgetRoomEngineUpdateEvent.GAME_MODE, event.roomId));
                return;
        }
    }, [ widgetHandler ]);

    useRoomEngineEvent(RoomEngineEvent.NORMAL_MODE, onRoomEngineEvent);
    useRoomEngineEvent(RoomEngineEvent.GAME_MODE, onRoomEngineEvent);

    const onRoomEngineObjectEvent = useCallback((event: RoomEngineObjectEvent) =>
    {
        if(!roomSession || !widgetHandler) return;

        const objectId  = event.objectId;
        const category  = event.category;

        let updateEvent: RoomWidgetRoomObjectUpdateEvent = null;

        switch(event.type)
        {
            case RoomEngineObjectEvent.SELECTED:
                if(!IsFurnitureSelectionDisabled(event)) updateEvent = new RoomWidgetRoomObjectUpdateEvent(RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED, objectId, category, event.roomId);
                break;
            case RoomEngineObjectEvent.DESELECTED:
                updateEvent = new RoomWidgetRoomObjectUpdateEvent(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, objectId, category, event.roomId);
                break;
            case RoomEngineObjectEvent.ADDED: {
                let addedEventType: string = null;

                switch(category)
                {
                    case RoomObjectCategory.FLOOR:
                    case RoomObjectCategory.WALL:
                        addedEventType = RoomWidgetRoomObjectUpdateEvent.FURNI_ADDED;
                        break;
                    case RoomObjectCategory.UNIT:
                        addedEventType = RoomWidgetRoomObjectUpdateEvent.USER_ADDED;
                        break;
                }

                if(addedEventType) updateEvent = new RoomWidgetRoomObjectUpdateEvent(addedEventType, objectId, category, event.roomId);
                break;
            }
            case RoomEngineObjectEvent.REMOVED: {
                let removedEventType: string = null;

                switch(category)
                {
                    case RoomObjectCategory.FLOOR:
                    case RoomObjectCategory.WALL:
                        removedEventType = RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED;
                        break;
                    case RoomObjectCategory.UNIT:
                        removedEventType = RoomWidgetRoomObjectUpdateEvent.USER_REMOVED;
                        break;
                }

                if(removedEventType) updateEvent = new RoomWidgetRoomObjectUpdateEvent(removedEventType, objectId, category, event.roomId);
                break;
            }
            case RoomEngineObjectEvent.MOUSE_ENTER:
                updateEvent = new RoomWidgetRoomObjectUpdateEvent(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OVER, objectId, category, event.roomId);
                break;
            case RoomEngineObjectEvent.MOUSE_LEAVE:
                updateEvent = new RoomWidgetRoomObjectUpdateEvent(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OUT, objectId, category, event.roomId);
                break;
            case RoomEngineObjectEvent.REQUEST_MOVE:
                if(CanManipulateFurniture(roomSession, objectId, category)) ProcessRoomObjectOperation(objectId, category, RoomObjectOperationType.OBJECT_MOVE);
                break;
            case RoomEngineObjectEvent.REQUEST_ROTATE:
                if(CanManipulateFurniture(roomSession, objectId, category)) ProcessRoomObjectOperation(objectId, category, RoomObjectOperationType.OBJECT_ROTATE_POSITIVE);
                break;
            case RoomEngineObjectEvent.REQUEST_MANIPULATION:
                if(CanManipulateFurniture(roomSession, objectId, category)) updateEvent = new RoomWidgetRoomObjectUpdateEvent(RoomWidgetRoomObjectUpdateEvent.OBJECT_REQUEST_MANIPULATION, objectId, category, event.roomId);
                break;
        }

        if(updateEvent)
        {
            let dispatchEvent = true;

            if(updateEvent instanceof RoomWidgetRoomObjectUpdateEvent) dispatchEvent = (!RoomId.isRoomPreviewerId(updateEvent.roomId));

            if(dispatchEvent) widgetHandler.eventDispatcher.dispatchEvent(updateEvent);
        }
    }, [ roomSession, widgetHandler ]);

    useRoomEngineEvent(RoomEngineObjectEvent.SELECTED, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.DESELECTED, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.ADDED, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.REMOVED, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.PLACED, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.MOUSE_ENTER, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.MOUSE_LEAVE, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.REQUEST_MOVE, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.REQUEST_ROTATE, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.REQUEST_MANIPULATION, onRoomEngineObjectEvent);

    if(!roomSession) return null;

    return (
        <RoomContextProvider value={ { roomSession, eventDispatcher: (widgetHandler && widgetHandler.eventDispatcher), widgetHandler } }>
            <div className="nitro-room w-100 h-100">
               <div id="room-view" className="nitro-room-container"></div>
                { roomCanvas && createPortal(null, document.getElementById('room-view').appendChild(roomCanvas)) }
                { widgetHandler && <RoomWidgetsView /> }
            </div>
        </RoomContextProvider>
    );
}
