import { IRoomSession, RoomEngineEvent, RoomEngineObjectEvent, RoomGeometry, RoomId, RoomObjectCategory, RoomObjectOperationType, RoomSessionEvent, RoomVariableEnum, Vector3d } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { CanManipulateFurniture, DispatchUiEvent, GetNitroInstance, GetRoomEngine, GetRoomSession, InitializeRoomInstanceRenderingCanvas, IsFurnitureSelectionDisabled, ProcessRoomObjectOperation, RoomWidgetUpdateRoomObjectEvent, SetActiveRoomId, StartRoomSession } from '../../api';
import { useRoomEngineEvent, useRoomSessionManagerEvent } from '../events';

const useRoomState = () =>
{
    const [ roomSession, setRoomSession ] = useState<IRoomSession>(null);

    const resize = useCallback((event: UIEvent = null) =>
    {
        const canvas = GetNitroInstance().renderer.view;

        if(!canvas) return;

        canvas.style.width = `${ Math.floor(window.innerWidth) }px`;
        canvas.style.height = `${ Math.floor(window.innerHeight) }px`;
    
        const nitroInstance = GetNitroInstance();

        nitroInstance.renderer.resolution = window.devicePixelRatio;
        nitroInstance.renderer.resize(window.innerWidth, window.innerHeight);
        
        InitializeRoomInstanceRenderingCanvas(window.innerWidth, window.innerHeight, 1);

        nitroInstance.render();
    }, []);

    useRoomEngineEvent<RoomEngineEvent>([
        RoomEngineEvent.INITIALIZED,
        RoomEngineEvent.DISPOSED
    ], event =>
    {
        if(RoomId.isRoomPreviewerId(event.roomId)) return;

        const session = GetRoomSession();

        if(!session) return;

        switch(event.type)
        {
            case RoomEngineEvent.INITIALIZED:
                SetActiveRoomId(event.roomId);
                setRoomSession(session);
                return;
            case RoomEngineEvent.DISPOSED:
                setRoomSession(null);
                return;
        }
    });

    useRoomSessionManagerEvent<RoomSessionEvent>([
        RoomSessionEvent.CREATED,
        RoomSessionEvent.ENDED
    ], event =>
    {
        switch(event.type)
        {
            case RoomSessionEvent.CREATED:
                StartRoomSession(event.session);
                return;
            case RoomSessionEvent.ENDED:
                setRoomSession(null);
                return;
        }
    });

    useRoomEngineEvent<RoomEngineObjectEvent>([
        RoomEngineObjectEvent.SELECTED,
        RoomEngineObjectEvent.DESELECTED,
        RoomEngineObjectEvent.ADDED,
        RoomEngineObjectEvent.REMOVED,
        RoomEngineObjectEvent.PLACED,
        RoomEngineObjectEvent.REQUEST_MOVE,
        RoomEngineObjectEvent.REQUEST_ROTATE,
        RoomEngineObjectEvent.MOUSE_ENTER,
        RoomEngineObjectEvent.MOUSE_LEAVE
    ], event =>
    {
        if(RoomId.isRoomPreviewerId(event.roomId)) return;

        let updateEvent: RoomWidgetUpdateRoomObjectEvent = null;

        switch(event.type)
        {
            case RoomEngineObjectEvent.SELECTED:
                if(!IsFurnitureSelectionDisabled(event)) updateEvent = new RoomWidgetUpdateRoomObjectEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_SELECTED, event.objectId, event.category, event.roomId);
                break;
            case RoomEngineObjectEvent.DESELECTED:
                updateEvent = new RoomWidgetUpdateRoomObjectEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_DESELECTED, event.objectId, event.category, event.roomId);
                break;
            case RoomEngineObjectEvent.ADDED: {
                let addedEventType: string = null;

                switch(event.category)
                {
                    case RoomObjectCategory.FLOOR:
                    case RoomObjectCategory.WALL:
                        addedEventType = RoomWidgetUpdateRoomObjectEvent.FURNI_ADDED;
                        break;
                    case RoomObjectCategory.UNIT:
                        addedEventType = RoomWidgetUpdateRoomObjectEvent.USER_ADDED;
                        break;
                }

                if(addedEventType) updateEvent = new RoomWidgetUpdateRoomObjectEvent(addedEventType, event.objectId, event.category, event.roomId);
                break;
            }
            case RoomEngineObjectEvent.REMOVED: {
                let removedEventType: string = null;

                switch(event.category)
                {
                    case RoomObjectCategory.FLOOR:
                    case RoomObjectCategory.WALL:
                        removedEventType = RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED;
                        break;
                    case RoomObjectCategory.UNIT:
                        removedEventType = RoomWidgetUpdateRoomObjectEvent.USER_REMOVED;
                        break;
                }

                if(removedEventType) updateEvent = new RoomWidgetUpdateRoomObjectEvent(removedEventType, event.objectId, event.category, event.roomId);
                break;
            }
            case RoomEngineObjectEvent.REQUEST_MOVE:
                if(CanManipulateFurniture(roomSession, event.objectId, event.category)) ProcessRoomObjectOperation(event.objectId, event.category, RoomObjectOperationType.OBJECT_MOVE);
                break;
            case RoomEngineObjectEvent.REQUEST_ROTATE:
                if(CanManipulateFurniture(roomSession, event.objectId, event.category)) ProcessRoomObjectOperation(event.objectId, event.category, RoomObjectOperationType.OBJECT_ROTATE_POSITIVE);
                break;
            case RoomEngineObjectEvent.MOUSE_ENTER:
                updateEvent = new RoomWidgetUpdateRoomObjectEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_ROLL_OVER, event.objectId, event.category, event.roomId);
                break;
            case RoomEngineObjectEvent.MOUSE_LEAVE:
                updateEvent = new RoomWidgetUpdateRoomObjectEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_ROLL_OUT, event.objectId, event.category, event.roomId);
                break;
        }

        if(updateEvent) DispatchUiEvent(updateEvent);
    });

    useEffect(() =>
    {
        if(!roomSession) return;

        const roomEngine = GetRoomEngine();
        const roomId = roomSession.roomId;
        const canvasId = 1;

        resize();
        
        const displayObject = roomEngine.getRoomInstanceDisplay(roomId, canvasId, window.innerWidth, window.innerHeight, RoomGeometry.SCALE_ZOOMED_IN);

        if(!displayObject) return;

        const geometry = (roomEngine.getRoomInstanceGeometry(roomId, canvasId) as RoomGeometry);

        if(geometry)
        {
            const minX = (roomEngine.getRoomInstanceVariable<number>(roomId, RoomVariableEnum.ROOM_MIN_X) || 0);
            const maxX = (roomEngine.getRoomInstanceVariable<number>(roomId, RoomVariableEnum.ROOM_MAX_X) || 0);
            const minY = (roomEngine.getRoomInstanceVariable<number>(roomId, RoomVariableEnum.ROOM_MIN_Y) || 0);
            const maxY = (roomEngine.getRoomInstanceVariable<number>(roomId, RoomVariableEnum.ROOM_MAX_Y) || 0);

            let x = ((minX + maxX) / 2);
            let y = ((minY + maxY) / 2);

            const offset = 20;

            x = (x + (offset - 1));
            y = (y + (offset - 1));

            const z = (Math.sqrt(((offset * offset) + (offset * offset))) * Math.tan(((30 / 180) * Math.PI)));

            geometry.location = new Vector3d(x, y, z);
        }

        const stage = GetNitroInstance().stage;

        if(!stage) return;

        stage.addChild(displayObject);

        SetActiveRoomId(roomSession.roomId);
    }, [ roomSession, resize ]);

    return { roomSession, resize };
}

export const useRoom = () => useBetween(useRoomState);
