import { EventDispatcher, IEventDispatcher, IRoomSession, RoomBackgroundColorEvent, RoomEngineDimmerStateEvent, RoomEngineEvent, RoomEngineObjectEvent, RoomId, RoomObjectCategory, RoomObjectHSLColorEnabledEvent, RoomObjectOperationType, RoomSessionEvent, RoomZoomEvent } from 'nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { ProcessRoomObjectOperation } from '../../api/nitro/room/ProcessRoomObjectOperation';
import { SetActiveRoomId } from '../../api/nitro/room/SetActiveRoomId';
import { GetRoomSession } from '../../api/nitro/session/GetRoomSession';
import { StartRoomSession } from '../../api/nitro/session/StartRoomSession';
import { useRoomEngineEvent } from '../../hooks/events/nitro/room/room-engine-event';
import { useRoomSessionManagerEvent } from '../../hooks/events/nitro/session/room-session-manager-event';
import { RoomErrorHandler } from '../room-error-handler/RoomErrorHandler';
import { RoomView } from '../room/RoomView';
import { RoomWidgetRoomEngineUpdateEvent, RoomWidgetRoomObjectUpdateEvent } from '../room/widgets/events';
import { RoomHostViewProps } from './RoomHostView.types';
import { CanManipulateFurniture } from './utils/CanManipulateFurniture';
import { IsFurnitureSelectionDisabled } from './utils/IsFurnitureSelectionDisabled';

export const RoomHostView: FC<RoomHostViewProps> = props =>
{
    const [ roomSession, setRoomSession ] = useState<IRoomSession>(null);
    const [ eventDispatcher, setEventDispatcher ] = useState<IEventDispatcher>(null);

    const onRoomEngineEvent = useCallback((event: RoomEngineEvent) =>
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
            case RoomEngineEvent.NORMAL_MODE:
                eventDispatcher.dispatchEvent(new RoomWidgetRoomEngineUpdateEvent(RoomWidgetRoomEngineUpdateEvent.RWREUE_NORMAL_MODE, event.roomId));
                return;
            case RoomEngineEvent.GAME_MODE:
                eventDispatcher.dispatchEvent(new RoomWidgetRoomEngineUpdateEvent(RoomWidgetRoomEngineUpdateEvent.RWREUE_GAME_MODE, event.roomId));
                return;
        }
    }, [ eventDispatcher ]);

    const onRoomEngineObjectEvent = useCallback((event: RoomEngineObjectEvent) =>
    {
        if(!roomSession || !eventDispatcher) return;

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

            if(dispatchEvent) eventDispatcher.dispatchEvent(updateEvent);
        }
    }, [ roomSession, eventDispatcher ]);

    const onRoomSessionEvent = useCallback((event: RoomSessionEvent) =>
    {
        switch(event.type)
        {
            case RoomSessionEvent.CREATED:
                setEventDispatcher(prevValue =>
                    {
                        if(prevValue) prevValue.removeAllListeners();

                        return new EventDispatcher();
                    });
                StartRoomSession(event.session);
                return;
            case RoomSessionEvent.ENDED:
                setRoomSession(null);
                setEventDispatcher(prevValue =>
                    {
                        if(prevValue) prevValue.removeAllListeners();

                        return null;
                    });
                return;
        }
    }, []);

    useRoomEngineEvent(RoomEngineEvent.INITIALIZED, onRoomEngineEvent);
    useRoomEngineEvent(RoomEngineEvent.DISPOSED, onRoomEngineEvent);
    useRoomEngineEvent(RoomEngineEvent.ENGINE_INITIALIZED, onRoomEngineEvent);
    useRoomEngineEvent(RoomEngineEvent.OBJECTS_INITIALIZED, onRoomEngineEvent);
    useRoomEngineEvent(RoomEngineEvent.NORMAL_MODE, onRoomEngineEvent);
    useRoomEngineEvent(RoomEngineEvent.GAME_MODE, onRoomEngineEvent);
    useRoomEngineEvent(RoomZoomEvent.ROOM_ZOOM, onRoomEngineEvent);
    useRoomEngineEvent(RoomObjectHSLColorEnabledEvent.ROOM_BACKGROUND_COLOR, onRoomEngineEvent);
    useRoomEngineEvent(RoomBackgroundColorEvent.ROOM_COLOR, onRoomEngineEvent);
    useRoomEngineEvent(RoomEngineDimmerStateEvent.ROOM_COLOR, onRoomEngineEvent);

    useRoomEngineEvent(RoomEngineObjectEvent.SELECTED, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.DESELECTED, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.ADDED, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.REMOVED, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.PLACED, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.REQUEST_MOVE, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.REQUEST_ROTATE, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.REQUEST_MANIPULATION, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.MOUSE_ENTER, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.MOUSE_LEAVE, onRoomEngineObjectEvent);

    useRoomSessionManagerEvent(RoomSessionEvent.CREATED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionEvent.ENDED, onRoomSessionEvent);

    return (
        <div className="nitro-room-host w-100 h-100">
            <RoomErrorHandler />
            <RoomView events={ eventDispatcher } roomSession={ roomSession } />
        </div>
    );
}
