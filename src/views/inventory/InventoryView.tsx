import { FC, useCallback, useState } from 'react';
import { InventoryEvent } from '../../events';
import { DraggableWindow } from '../../hooks/draggable-window/DraggableWindow';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { LocalizeText } from '../../utils/LocalizeText';
import { InventoryMessageHandler } from './InventoryMessageHandler';
import { InventoryViewProps } from './InventoryView.types';

export const InventoryView: FC<InventoryViewProps> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);

    const onInventoryEvent = useCallback((event: InventoryEvent) =>
    {
        switch(event.type)
        {
            case InventoryEvent.SHOW_INVENTORY:
                setIsVisible(true);
                return;
            case InventoryEvent.TOGGLE_INVENTORY:
                setIsVisible(value => !value);
                return;
        }
    }, []);

    useUiEvent(InventoryEvent.SHOW_INVENTORY, onInventoryEvent);
    useUiEvent(InventoryEvent.TOGGLE_INVENTORY, onInventoryEvent);

    function hideInventory(): void
    {
        setIsVisible(false);
    }

    return (
        <>
            <InventoryMessageHandler  />
            { isVisible && <DraggableWindow handle=".drag-handler">
                <div className="nitro-inventory d-flex flex-column bg-primary border border-black shadow rounded">
                    <div className="drag-handler d-flex justify-content-between align-items-center px-3 pt-3">
                        <div className="h6 m-0">{ LocalizeText('inventory.title') }</div>
                        <button type="button" className="close" onClick={ hideInventory }>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <div className="d-flex p-3">
                        content
                    </div>
                </div>
            </DraggableWindow> }
        </>
    );
}
