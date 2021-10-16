import { RoomObjectOperationType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { ProcessRoomObjectOperation, RoomWidgetUpdateDecorateModeEvent, RoomWidgetUpdateRoomObjectEvent } from '../../../../../api';
import { BatchUpdates } from '../../../../../hooks';
import { CreateEventDispatcherHook } from '../../../../../hooks/events/event-dispatcher.base';
import { useRoomContext } from '../../../context/RoomContext';
import { ObjectLocationView } from '../../object-location/ObjectLocationView';

export const FurnitureManipulationMenuView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ objectId, setObjectId ] = useState(-1);
    const [ objectType, setObjectType ] = useState(-1);
    const { roomSession = null, eventDispatcher = null, widgetHandler = null } = useRoomContext();

    const rotateFurniture = useCallback(() =>
    {
        ProcessRoomObjectOperation(objectId, objectType, RoomObjectOperationType.OBJECT_ROTATE_POSITIVE);
    }, [ objectId, objectType ]);

    const moveFurniture = useCallback(() =>
    {
        ProcessRoomObjectOperation(objectId, objectType, RoomObjectOperationType.OBJECT_MOVE);
    }, [ objectId, objectType ]);

    const pickupFurniture = useCallback(() =>
    {
        ProcessRoomObjectOperation(objectId, objectType, RoomObjectOperationType.OBJECT_PICKUP);
    }, [ objectId, objectType ]);

    const onRoomWidgetRoomObjectUpdateEvent = useCallback((event: RoomWidgetUpdateRoomObjectEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetUpdateRoomObjectEvent.OBJECT_REQUEST_MANIPULATION: {
                BatchUpdates(() =>
                {
                    setIsVisible(true);
                    setObjectId(event.id);
                    setObjectType(event.category);
                });
                return;
            }
            case RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED: {
                if(event.id === objectId)
                {
                    BatchUpdates(() =>
                    {
                        setIsVisible(false);
                        setObjectId(-1);
                        setObjectType(-1);
                    });
                }
                return;
            }
            case RoomWidgetUpdateRoomObjectEvent.OBJECT_DESELECTED: {
                BatchUpdates(() =>
                {
                    setIsVisible(false);
                    setObjectId(-1);
                    setObjectType(-1);
                });
                return;
            }
        }
    }, [ objectId ]);

    CreateEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.OBJECT_REQUEST_MANIPULATION, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.OBJECT_DESELECTED, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent);

    const onRoomWidgetUpdateDecorateModeEvent = useCallback((event: RoomWidgetUpdateDecorateModeEvent) =>
    {
        if(event.isDecorating) return;

        moveFurniture();

        BatchUpdates(() =>
        {
            setIsVisible(false);
            setObjectId(-1);
            setObjectType(-1);
        });
    }, [ moveFurniture ]);

    CreateEventDispatcherHook(RoomWidgetUpdateDecorateModeEvent.UPDATE_DECORATE, eventDispatcher, onRoomWidgetUpdateDecorateModeEvent);

    useEffect(() =>
    {
        if(!isVisible)
        {
            eventDispatcher.dispatchEvent(new RoomWidgetUpdateDecorateModeEvent(false));

            return;
        }

        eventDispatcher.dispatchEvent(new RoomWidgetUpdateDecorateModeEvent(true));

        moveFurniture();
    }, [ eventDispatcher, isVisible, moveFurniture ]);

    if(!isVisible) return null;

    return (
        <ObjectLocationView objectId={ objectId } category={ objectType }>
            <div className="btn-group">
                <button type="button" className="btn btn-primary btn-sm" onClick={ pickupFurniture }>
                    <i className="fas fa-times" />
                </button>
                <button type="button" className="btn btn-primary btn-sm" onClick={ rotateFurniture }>
                    <i className="fas fa-undo" />
                </button>
            </div>
        </ObjectLocationView>
    );
}
