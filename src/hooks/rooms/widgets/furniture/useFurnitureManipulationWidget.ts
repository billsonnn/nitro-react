import { RoomEngineObjectEvent, RoomId, RoomObjectCategory, RoomObjectOperationType } from '@nitrots/nitro-renderer';
import { useCallback, useState } from 'react';
import { CanManipulateFurniture, IsFurnitureSelectionDisabled, ProcessRoomObjectOperation, RoomWidgetUpdateRoomObjectEvent } from '../../../../api';
import { UI_EVENT_DISPATCHER, UseRoomEngineEvent } from '../../../events';
import { useRoom } from '../../useRoom';

const useFurnitureManipulationWidgetState = () =>
{
    const [ manipulatingId, setManipulatingId ] = useState(-1);
    const [ manipulatingCategory, setManipulatingCategory ] = useState(-1);
    const { roomSession = null, widgetHandler = null } = useRoom();

    const moveObject = () => ProcessRoomObjectOperation(manipulatingId, manipulatingCategory, RoomObjectOperationType.OBJECT_MOVE);

    const onRoomEngineObjectEvent = useCallback((event: RoomEngineObjectEvent) =>
    {
        let updateEvent: RoomWidgetUpdateRoomObjectEvent = null;

        switch(event.type)
        {
            case RoomEngineObjectEvent.SELECTED:
                if(!IsFurnitureSelectionDisabled(event)) updateEvent = new RoomWidgetUpdateRoomObjectEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_SELECTED, event.objectId, event.category, event.roomId);
                break;
            case RoomEngineObjectEvent.DESELECTED:
                updateEvent = new RoomWidgetUpdateRoomObjectEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_DESELECTED, event.objectId, event.category, event.roomId);

                if(manipulatingId > -1)
                {
                    setManipulatingId(-1);
                    setManipulatingCategory(-1); 
                }
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

                        if(manipulatingId === event.objectId)
                        {
                            setManipulatingId(-1);
                            setManipulatingCategory(-1);
                        }
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
            case RoomEngineObjectEvent.REQUEST_MANIPULATION:
                if(CanManipulateFurniture(roomSession, event.objectId, event.category))
                {
                    setManipulatingId(event.objectId);
                    setManipulatingCategory(event.category);
                }
                break;
            case RoomEngineObjectEvent.MOUSE_ENTER:
                updateEvent = new RoomWidgetUpdateRoomObjectEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_ROLL_OVER, event.objectId, event.category, event.roomId);
                break;
            case RoomEngineObjectEvent.MOUSE_LEAVE:
                updateEvent = new RoomWidgetUpdateRoomObjectEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_ROLL_OUT, event.objectId, event.category, event.roomId);
                break;
        }

        if(updateEvent)
        {
            let dispatchEvent = true;

            if(updateEvent instanceof RoomWidgetUpdateRoomObjectEvent) dispatchEvent = (!RoomId.isRoomPreviewerId(updateEvent.roomId));

            if(dispatchEvent)
            {
                widgetHandler.eventDispatcher.dispatchEvent(updateEvent);

                UI_EVENT_DISPATCHER.dispatchEvent(updateEvent);
            }
        }
    }, [ roomSession, widgetHandler, manipulatingId ]);

    UseRoomEngineEvent(RoomEngineObjectEvent.SELECTED, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineObjectEvent.DESELECTED, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineObjectEvent.ADDED, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineObjectEvent.REMOVED, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineObjectEvent.PLACED, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineObjectEvent.REQUEST_MOVE, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineObjectEvent.REQUEST_ROTATE, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineObjectEvent.REQUEST_MANIPULATION, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineObjectEvent.MOUSE_ENTER, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineObjectEvent.MOUSE_LEAVE, onRoomEngineObjectEvent);

    return { manipulatingId, manipulatingCategory, moveObject };
}

export const useFurnitureManipulationWidget = useFurnitureManipulationWidgetState;
