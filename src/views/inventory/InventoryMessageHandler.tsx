import { FurnitureListAddOrUpdateEvent, FurnitureListEvent, FurnitureListInvalidateEvent, FurnitureListItemParser, FurnitureListRemovedEvent, FurniturePostItPlacedEvent } from 'nitro-renderer';
import { FC, useCallback } from 'react';
import { CreateMessageHook } from '../../hooks/messages/message-event';
import { InventoryMessageHandlerProps } from './InventoryMessageHandler.types';
import { FurnitureItem } from './utils/FurnitureItem';
import { addFurnitureItem, getGroupItemForFurnitureId, mergeFragments, processFragment, removeItemById } from './utils/FurnitureUtilities';

let furniMsgFragments: Map<number, FurnitureListItemParser>[] = null;
 
export const InventoryMessageHandler: FC<InventoryMessageHandlerProps> = props =>
{
    const { setNeedsFurniUpdate = null, setGroupItems = null } = props;

    const onFurnitureListAddOrUpdateEvent = useCallback((event: FurnitureListAddOrUpdateEvent) =>
    {
        const parser = event.getParser();

        setGroupItems(prevValue =>
            {
                const newSet = [ ...prevValue ];

                for(const item of parser.items)
                {
                    const groupItem = getGroupItemForFurnitureId(newSet, item.itemId);

                    if(groupItem)
                    {
                        const furniture = groupItem.getItemById(item.itemId);

                        if(furniture)
                        {
                            furniture.update(item);

                            groupItem.hasUnseenItems = true;
                        }
                    }
                    else
                    {
                        const furniture = new FurnitureItem(item);

                        addFurnitureItem(newSet, furniture, false);
                    }
                }

                return newSet;
            });
    }, [ setGroupItems ]);

    const onFurnitureListEvent = useCallback((event: FurnitureListEvent) =>
    {
        const parser = event.getParser();
        
        if(!furniMsgFragments) furniMsgFragments = new Array(parser.totalFragments);

        const merged = mergeFragments(parser.fragment, parser.totalFragments, parser.fragmentNumber, furniMsgFragments);

        if(!merged) return;

        setGroupItems(prevValue =>
            {
                return processFragment(prevValue, merged);
            });
    }, [ setGroupItems ]);

    const onFurnitureListInvalidateEvent = useCallback((event: FurnitureListInvalidateEvent) =>
    {
        setNeedsFurniUpdate(true);
    }, [ setNeedsFurniUpdate ]);

    const onFurnitureListRemovedEvent = useCallback((event: FurnitureListRemovedEvent) =>
    {
        const parser = event.getParser();

        setGroupItems(prevValue =>
            {
                const newSet = [ ...prevValue ];

                const groupItem = removeItemById(parser.itemId, newSet);

                if(groupItem)
                {
                    // set all seen

                    return newSet;
                }

                return prevValue;
            });
    }, [ setGroupItems ]);

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
