import { CreateLinkEvent, FurnitureListAddOrUpdateEvent, FurnitureListComposer, FurnitureListEvent, FurnitureListInvalidateEvent, FurnitureListItemParser, FurnitureListRemovedEvent, FurniturePostItPlacedEvent } from '@nitrots/nitro-renderer';
import { useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { CloneObject, DispatchUiEvent, FurnitureItem, GroupItem, SendMessageComposer, UnseenItemCategory, addFurnitureItem, attemptItemPlacement, cancelRoomObjectPlacement, getAllItemIds, getPlacingItemId, mergeFurniFragments } from '../../api';
import { InventoryFurniAddedEvent } from '../../events';
import { useMessageEvent } from '../events';
import { useSharedVisibility } from '../useSharedVisibility';
import { useInventoryUnseenTracker } from './useInventoryUnseenTracker';

let furniMsgFragments: Map<number, FurnitureListItemParser>[] = null;

const useInventoryFurniState = () =>
{
    const [ needsUpdate, setNeedsUpdate ] = useState(true);
    const [ groupItems, setGroupItems ] = useState<GroupItem[]>([]);
    const [ selectedItem, setSelectedItem ] = useState<GroupItem>(null);
    const { isVisible = false, activate = null, deactivate = null } = useSharedVisibility();
    const { isUnseen = null, resetCategory = null } = useInventoryUnseenTracker();

    const getItemsByType = (type: number) =>
    {
        if(!groupItems || !groupItems.length) return;

        return groupItems.filter((i) => i.type === type);
    }

    const getWallItemById = (id: number) =>
    {
        if(!groupItems || !groupItems.length) return;

        for(const groupItem of groupItems)
        {
            const item = groupItem.getItemById(id);

            if(item && item.isWallItem) return groupItem;
        }

        return null;
    }

    const getFloorItemById = (id: number) =>
    {
        if(!groupItems || !groupItems.length) return;

        for(const groupItem of groupItems)
        {
            const item = groupItem.getItemById(id);

            if(item && !item.isWallItem) return groupItem;
        }

        return null;
    }

    useMessageEvent<FurnitureListAddOrUpdateEvent>(FurnitureListAddOrUpdateEvent, event =>
    {
        const parser = event.getParser();

        setGroupItems(prevValue =>
        {
            const newValue = [ ...prevValue ];

            for(const item of parser.items)
            {
                let i = 0;
                let groupItem: GroupItem = null;

                while(i < newValue.length)
                {
                    const group = newValue[i];

                    let j = 0;

                    while(j < group.items.length)
                    {
                        const furniture = group.items[j];

                        if(furniture.id === item.itemId)
                        {
                            furniture.update(item);

                            const newFurniture = [ ...group.items ];

                            newFurniture[j] = furniture;

                            group.items = newFurniture;

                            groupItem = group;

                            break;
                        }

                        j++
                    }

                    if(groupItem) break;

                    i++;
                }

                if(groupItem)
                {
                    groupItem.hasUnseenItems = true;

                    newValue[i] = CloneObject(groupItem);
                }
                else
                {
                    const furniture = new FurnitureItem(item);

                    addFurnitureItem(newValue, furniture, isUnseen(UnseenItemCategory.FURNI, item.itemId));

                    DispatchUiEvent(new InventoryFurniAddedEvent(furniture.id, furniture.type, furniture.category));
                }
            }

            return newValue;
        });
    });

    useMessageEvent<FurnitureListEvent>(FurnitureListEvent, event =>
    {
        const parser = event.getParser();
        
        if(!furniMsgFragments) furniMsgFragments = new Array(parser.totalFragments);

        const fragment = mergeFurniFragments(parser.fragment, parser.totalFragments, parser.fragmentNumber, furniMsgFragments);

        if(!fragment) return;

        setGroupItems(prevValue =>
        {
            const newValue = [ ...prevValue ];
            const existingIds = getAllItemIds(newValue);

            for(const existingId of existingIds)
            {
                if(fragment.get(existingId)) continue;

                let index = 0;

                while(index < newValue.length)
                {
                    const group = newValue[index];
                    const item = group.remove(existingId);

                    if(!item)
                    {
                        index++;

                        continue;
                    }
                        
                    if(getPlacingItemId() === item.ref)
                    {
                        cancelRoomObjectPlacement();

                        if(!attemptItemPlacement(group))
                        {
                            CreateLinkEvent('inventory/show');
                        }
                    }

                    if(group.getTotalCount() <= 0)
                    {
                        newValue.splice(index, 1);

                        group.dispose();
                    }

                    break;
                }
            }

            for(const itemId of fragment.keys())
            {
                if(existingIds.indexOf(itemId) >= 0) continue;

                const parser = fragment.get(itemId);

                if(!parser) continue;

                const item = new FurnitureItem(parser);

                addFurnitureItem(newValue, item, isUnseen(UnseenItemCategory.FURNI, itemId));

                DispatchUiEvent(new InventoryFurniAddedEvent(item.id, item.type, item.category));

            }

            return newValue;
        });

        furniMsgFragments = null;
    });

    useMessageEvent<FurnitureListInvalidateEvent>(FurnitureListInvalidateEvent, event =>
    {
        setNeedsUpdate(true);
    });

    useMessageEvent<FurnitureListRemovedEvent>(FurnitureListRemovedEvent, event =>
    {
        const parser = event.getParser();

        setGroupItems(prevValue =>
        {
            const newValue = [ ...prevValue ];

            let index = 0;

            while(index < newValue.length)
            {
                const group = newValue[index];
                const item = group.remove(parser.itemId);

                if(!item)
                {
                    index++;

                    continue;
                }
                    
                if(getPlacingItemId() === item.ref)
                {
                    cancelRoomObjectPlacement();

                    if(!attemptItemPlacement(group)) CreateLinkEvent('inventory/show');
                }

                if(group.getTotalCount() <= 0)
                {
                    newValue.splice(index, 1);

                    group.dispose();
                }

                break;
            }

            return newValue;
        });
    });

    useMessageEvent<FurniturePostItPlacedEvent>(FurniturePostItPlacedEvent, event =>
    {

    });

    useEffect(() =>
    {
        if(!groupItems || !groupItems.length) return;

        setSelectedItem(prevValue =>
        {
            let newValue = prevValue;

            if(newValue && (groupItems.indexOf(newValue) === -1)) newValue = null;

            if(!newValue) newValue = groupItems[0];

            return newValue;
        });
    }, [ groupItems ]);

    useEffect(() =>
    {
        if(!isVisible) return;

        return () =>
        {
            if(resetCategory(UnseenItemCategory.FURNI))
            {
                setGroupItems(prevValue =>
                {
                    const newValue = [ ...prevValue ];
        
                    for(const newGroup of newValue) newGroup.hasUnseenItems = false;
        
                    return newValue;
                });
            }
        }
    }, [ isVisible, resetCategory ]);

    useEffect(() =>
    {
        if(!isVisible || !needsUpdate) return;

        SendMessageComposer(new FurnitureListComposer());

        setNeedsUpdate(false);
    }, [ isVisible, needsUpdate ]);

    return { isVisible, groupItems, setGroupItems, selectedItem, setSelectedItem, activate, deactivate, getWallItemById, getFloorItemById, getItemsByType };
}

export const useInventoryFurni = () => useBetween(useInventoryFurniState);
