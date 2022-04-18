import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RoomObjectOperationType } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { ProcessRoomObjectOperation } from '../../../../api';
import { Button, ButtonGroup } from '../../../../common';
import { useFurnitureManipulationWidget } from '../../../../hooks';
import { ObjectLocationView } from '../object-location/ObjectLocationView';

export const FurnitureManipulationMenuView: FC<{}> = props =>
{
    const { manipulatingId = -1, manipulatingCategory = -1 } = useFurnitureManipulationWidget();

    // const onRoomWidgetUpdateDecorateModeEvent = useCallback((event: RoomWidgetUpdateDecorateModeEvent) =>
    // {
    //     if(event.isDecorating) return;

    //     moveFurniture();

    //     setIsVisible(false);
    //     setObjectId(-1);
    //     setCategory(-1);
    // }, [ moveFurniture ]);

    // UseEventDispatcherHook(RoomWidgetUpdateDecorateModeEvent.UPDATE_DECORATE, eventDispatcher, onRoomWidgetUpdateDecorateModeEvent);

    // useEffect(() =>
    // {
    //     if(!isVisible)
    //     {
    //         eventDispatcher.dispatchEvent(new RoomWidgetUpdateDecorateModeEvent(false));

    //         return;
    //     }

    //     eventDispatcher.dispatchEvent(new RoomWidgetUpdateDecorateModeEvent(true));

    //     moveFurniture();
    // }, [ eventDispatcher, isVisible, moveFurniture ]);

    if((manipulatingId === -1) || (manipulatingCategory === -1)) return null;

    return (
        <ObjectLocationView objectId={ manipulatingId } category={ manipulatingCategory }>
            <ButtonGroup>
                <Button onClick={ event => ProcessRoomObjectOperation(manipulatingId, manipulatingCategory, RoomObjectOperationType.OBJECT_PICKUP) }>
                    <FontAwesomeIcon icon="times" />
                </Button>
                <Button onClick={ event => ProcessRoomObjectOperation(manipulatingId, manipulatingCategory, RoomObjectOperationType.OBJECT_ROTATE_POSITIVE) }>
                    <FontAwesomeIcon icon="undo" />
                </Button>
            </ButtonGroup>
        </ObjectLocationView>
    );
}
