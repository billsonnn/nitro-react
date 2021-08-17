import { RoomObjectOperationType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { ProcessRoomObjectOperation, RoomWidgetRoomObjectUpdateEvent } from '../../../../../api';
import { CreateEventDispatcherHook } from '../../../../../hooks/events/event-dispatcher.base';
import { useRoomContext } from '../../../context/RoomContext';
import { ObjectLocationView } from '../../object-location/ObjectLocationView';

export const FurnitureManipulationMenuView: FC<{}> = props =>
{
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
    const [ isVisible, setIsVisible ] = useState(false);
    const [ objectId, setObjectId ] = useState(-1);
    const [ objectType, setObjectType ] = useState(-1);

    const onRoomWidgetRoomObjectUpdateEvent = useCallback((event: RoomWidgetRoomObjectUpdateEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_REQUEST_MANIPULATION: {
                setIsVisible(true);
                setObjectId(event.id);
                setObjectType(event.category);
                return;
            }
            case RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED: {
                return;
            }
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED: {
                setIsVisible(false);
                return;
            }
        }
    }, []);

    const rotateFurniture = useCallback(() =>
    {
        ProcessRoomObjectOperation(objectId, objectType, RoomObjectOperationType.OBJECT_ROTATE_POSITIVE);
    }, [ objectId, objectType ]);

    const moveFurniture = useCallback(() =>
    {
        ProcessRoomObjectOperation(objectId, objectType, RoomObjectOperationType.OBJECT_MOVE);
    }, [ objectId, objectType ]);

    useEffect(() =>
    {
        if(!isVisible) return;

        moveFurniture();
    }, [ isVisible, moveFurniture ]);

    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.OBJECT_REQUEST_MANIPULATION, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent);

    if(!isVisible) return null;

    return (
        <ObjectLocationView objectId={ objectId } category={ objectType }>
            <div className="btn-group">
                <button type="button" className="btn btn-primary btn-sm">
                    <i className="fas fa-times" />
                </button>
                <button type="button" className="btn btn-primary btn-sm" onClick={ rotateFurniture }>
                    <i className="fas fa-undo" />
                </button>
            </div>
        </ObjectLocationView>
    );
}
