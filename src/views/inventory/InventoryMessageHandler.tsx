import { FurnitureListAddOrUpdateEvent, FurnitureListEvent, FurnitureListInvalidateEvent, FurnitureListItemParser, FurnitureListRemovedEvent, FurniturePostItPlacedEvent } from 'nitro-renderer';
import { FC, useCallback } from 'react';
import { CreateMessageHook } from '../../hooks/messages/message-event';
import { useInventoryContext } from './context/InventoryContext';
import { InventoryMessageHandlerProps } from './InventoryMessageHandler.types';
import { InventoryFurnitureActions } from './reducers/InventoryFurnitureReducer';
import { mergeFragments } from './utils/FurnitureUtilities';

let furniMsgFragments: Map<number, FurnitureListItemParser>[] = null;
 
export const InventoryMessageHandler: FC<InventoryMessageHandlerProps> = props =>
{
    const { dispatchFurnitureState = null } = useInventoryContext();

    const onFurnitureListAddOrUpdateEvent = useCallback((event: FurnitureListAddOrUpdateEvent) =>
    {
        const parser = event.getParser();

        dispatchFurnitureState({
            type: InventoryFurnitureActions.ADD_OR_UPDATE_FURNITURE,
            payload: {
                parsers: parser.items
            }
        });
    }, [ dispatchFurnitureState ]);

    const onFurnitureListEvent = useCallback((event: FurnitureListEvent) =>
    {
        const parser = event.getParser();
        
        if(!furniMsgFragments) furniMsgFragments = new Array(parser.totalFragments);

        const fragment = mergeFragments(parser.fragment, parser.totalFragments, parser.fragmentNumber, furniMsgFragments);

        if(!fragment) return;

        dispatchFurnitureState({
            type: InventoryFurnitureActions.PROCESS_FRAGMENT,
            payload: { fragment }
        });
    }, [ dispatchFurnitureState ]);

    const onFurnitureListInvalidateEvent = useCallback((event: FurnitureListInvalidateEvent) =>
    {
        dispatchFurnitureState({
            type: InventoryFurnitureActions.SET_NEEDS_UPDATE,
            payload: { 
                flag: true
            }
        });
    }, [ dispatchFurnitureState ]);

    const onFurnitureListRemovedEvent = useCallback((event: FurnitureListRemovedEvent) =>
    {
        const parser = event.getParser();

        dispatchFurnitureState({
            type: InventoryFurnitureActions.REMOVE_FURNITURE,
            payload: { 
                itemId: parser.itemId
            }
        });
    }, [ dispatchFurnitureState ]);

    const onFurniturePostItPlacedEvent = useCallback((event: FurniturePostItPlacedEvent) =>
    {

    }, []);

    CreateMessageHook(FurnitureListAddOrUpdateEvent, onFurnitureListAddOrUpdateEvent);
    CreateMessageHook(FurnitureListEvent, onFurnitureListEvent);
    CreateMessageHook(FurnitureListInvalidateEvent, onFurnitureListInvalidateEvent);
    CreateMessageHook(FurnitureListRemovedEvent, onFurnitureListRemovedEvent);
    CreateMessageHook(FurniturePostItPlacedEvent, onFurniturePostItPlacedEvent);

    return null;
}
