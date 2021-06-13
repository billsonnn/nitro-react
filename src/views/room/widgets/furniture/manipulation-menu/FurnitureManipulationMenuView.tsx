import { RoomObjectOperationType } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { ProcessRoomObjectOperation } from '../../../../../api';
import { CreateEventDispatcherHook } from '../../../../../hooks/events/event-dispatcher.base';
import { RoomWidgetRoomObjectUpdateEvent } from '../../events';
import { ObjectLocationView } from '../../object-location/ObjectLocationView';
import { FurnitureManipulationMenuViewProps } from './FurnitureManipulationMenuView.types';

export const FurnitureManipulationMenuView: FC<FurnitureManipulationMenuViewProps> = props =>
{
    const { events = null } = props;
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
                console.log('tru')
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

    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.OBJECT_REQUEST_MANIPULATION, events, onRoomWidgetRoomObjectUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, events, onRoomWidgetRoomObjectUpdateEvent);

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
