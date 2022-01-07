import { FurnitureListItemParser, FurniturePlacePaintComposer, IObjectData, RoomObjectCategory, RoomObjectPlacementSource } from '@nitrots/nitro-renderer';
import { GetRoomEngine } from '../../../api';
import { InventoryEvent } from '../../../events';
import { CatalogPostMarketplaceOfferEvent } from '../../../events/catalog/CatalogPostMarketplaceOfferEvent';
import { dispatchUiEvent } from '../../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../../hooks/messages/message-event';
import { FurniCategory } from './FurniCategory';
import { FurnitureItem } from './FurnitureItem';
import { GroupItem } from './GroupItem';
import { getPlacingItemId, setObjectMoverRequested, setPlacingItemId } from './InventoryUtilities';
import { IUnseenItemTracker } from './unseen/IUnseenItemTracker';
import { UnseenItemCategory } from './unseen/UnseenItemCategory';

export function attemptItemPlacement(groupItem: GroupItem, flag: boolean = false): boolean
{
    if(!groupItem || !groupItem.getUnlockedCount()) return false;

    const item = groupItem.getLastItem();

    if(!item) return false;

    if((item.category === FurniCategory.FLOOR) || (item.category === FurniCategory.WALL_PAPER) || (item.category === FurniCategory.LANDSCAPE))
    {
        if(flag) return false;

        SendMessageHook(new FurniturePlacePaintComposer(item.id));

        return false;
    }
    else
    {
        dispatchUiEvent(new InventoryEvent(InventoryEvent.HIDE_INVENTORY));

        let category    = 0;
        let isMoving    = false;

        if(item.isWallItem) category = RoomObjectCategory.WALL;
        else category = RoomObjectCategory.FLOOR;

        if((item.category === FurniCategory.POSTER)) // or external image from furnidata
        {
            isMoving = GetRoomEngine().processRoomObjectPlacement(RoomObjectPlacementSource.INVENTORY, item.id, category, item.type, item.stuffData.getLegacyString());
        }
        else
        {
            isMoving = GetRoomEngine().processRoomObjectPlacement(RoomObjectPlacementSource.INVENTORY, item.id, category, item.type, item.extra.toString(), item.stuffData);
        }

        if(isMoving)
        {
            setPlacingItemId(item.ref);
            setObjectMoverRequested(true);
        }
    }

    return true;
}

export function attemptPlaceMarketplaceOffer(groupItem: GroupItem): boolean
{
    const item = groupItem.getLastItem();

    if(!item) return false;

    if(!item.sellable) return false;

    dispatchUiEvent(new CatalogPostMarketplaceOfferEvent(item));
}

function cancelRoomObjectPlacement(): void
{
    if(getPlacingItemId() === -1) return;
    
    GetRoomEngine().cancelRoomObjectPlacement();

    setPlacingItemId(-1);
    setObjectMoverRequested(false);
}

export function getGroupItemForFurnitureId(set: GroupItem[], id: number): GroupItem
{
    for(const groupItem of set)
    {
        if(groupItem.getItemById(id)) return groupItem;
    }

    return null;
}

export function mergeFurniFragments(fragment: Map<number, FurnitureListItemParser>, totalFragments: number, fragmentNumber: number, fragments: Map<number, FurnitureListItemParser>[])
{
    if(totalFragments === 1) return fragment;

    fragments[fragmentNumber] = fragment;

    for(const frag of fragments)
    {
        if(!frag) return null;
    }

    const merged: Map<number, FurnitureListItemParser> = new Map();

    for(const frag of fragments)
    {
        for(const [ key, value ] of frag) merged.set(key, value);

        frag.clear();
    }

    fragments = null;

    return merged;
}

function getAllItemIds(groupItems: GroupItem[]): number[]
{
    const itemIds: number[] = [];

    for(const groupItem of groupItems)
    {
        let totalCount = groupItem.getTotalCount();

        if(groupItem.category === FurniCategory.POST_IT) totalCount = 1;

        let i = 0;

        while(i < totalCount)
        {
            itemIds.push(groupItem.getItemByIndex(i).id);

            i++;
        }
    }

    return itemIds;
}

export function processFurniFragment(set: GroupItem[], fragment: Map<number, FurnitureListItemParser>, unseenTracker: IUnseenItemTracker): GroupItem[]
{
    const existingIds = getAllItemIds(set);
    const addedIds: number[] = [];
    const removedIds: number[] = [];

    for(const key of fragment.keys()) (existingIds.indexOf(key) === -1) && addedIds.push(key);

    for(const itemId of existingIds) (!fragment.get(itemId)) && removedIds.push(itemId);

    const emptyExistingSet = (existingIds.length === 0);

    for(const id of removedIds) removeFurniItemById(id, set);

    for(const id of addedIds)
    {
        const parser = fragment.get(id);

        if(!parser) continue;

        const item = new FurnitureItem(parser);

        addFurnitureItem(set, item, unseenTracker.isUnseen(UnseenItemCategory.FURNI, id));
    }

    return set;
}

export function removeFurniItemById(id: number, set: GroupItem[]): GroupItem
{
    let index = 0;

    while(index < set.length)
    {
        const group = set[index];
        const item = group.remove(id);

        if(item)
        {
            if(getPlacingItemId() === item.ref)
            {
                cancelRoomObjectPlacement();

                if(!attemptItemPlacement(group))
                {
                    setTimeout(() => dispatchUiEvent(new InventoryEvent(InventoryEvent.SHOW_INVENTORY)), 1);
                }
            }

            if(group.getTotalCount() <= 0)
            {
                set.splice(index, 1);

                group.dispose();
            }

            return group;
        }

        index++;
    }

    return null;
}

export function addFurnitureItem(set: GroupItem[], item: FurnitureItem, unseen: boolean): void
{
    if(!item.isGroupable)
    {
        addSingleFurnitureItem(set, item, unseen);
    }
    else
    {
        addGroupableFurnitureItem(set, item, unseen);
    }
}

function addSingleFurnitureItem(set: GroupItem[], item: FurnitureItem, unseen: boolean): GroupItem
{
    const groupItems: GroupItem[] = [];

    for(const groupItem of set)
    {
        if(groupItem.type === item.type) groupItems.push(groupItem);
    }

    for(const groupItem of groupItems)
    {
        if(groupItem.getItemById(item.id)) return groupItem;
    }

    const groupItem = createGroupItem(item.type, item.category, item.stuffData, item.extra);

    groupItem.push(item);

    if(unseen)
    {
        groupItem.hasUnseenItems = true;

        set.unshift(groupItem);
    }
    else
    {
        set.push(groupItem);
    }

    return groupItem;
}

function addGroupableFurnitureItem(set: GroupItem[], item: FurnitureItem, unseen: boolean): GroupItem
{
    let existingGroup: GroupItem = null;

    for(const groupItem of set)
    {
        if((groupItem.type === item.type) && (groupItem.isWallItem === item.isWallItem) && groupItem.isGroupable)
        {
            if(item.category === FurniCategory.POSTER)
            {
                if(groupItem.stuffData.getLegacyString() === item.stuffData.getLegacyString())
                {
                    existingGroup = groupItem;

                    break;
                }
            }

            else if(item.category === FurniCategory.GUILD_FURNI)
            {
                if(item.stuffData.compare(groupItem.stuffData))
                {
                    existingGroup = groupItem;

                    break;
                }
            }

            else
            {
                existingGroup = groupItem;

                break;
            }
        }
    }

    if(existingGroup)
    {
        existingGroup.push(item);

        if(unseen)
        {
            existingGroup.hasUnseenItems = true;

            const index = set.indexOf(existingGroup);

            if(index >= 0) set.splice(index, 1);
            
            set.unshift(existingGroup);
        }

        return existingGroup;
    }

    existingGroup = createGroupItem(item.type, item.category, item.stuffData, item.extra);

    existingGroup.push(item);

    if(unseen)
    {
        existingGroup.hasUnseenItems = true;

        set.unshift(existingGroup);
    }
    else
    {
        set.push(existingGroup);
    }

    return existingGroup;
}

export function createGroupItem(type: number, category: number, stuffData: IObjectData, extra: number = NaN): GroupItem
{
    // const iconImage: HTMLImageElement = null;

    if(category === FurniCategory.WALL_PAPER)
    {
        // const icon = this._windowManager.assets.getAssetByName("inventory_furni_icon_wallpaper");
        // if (icon != null)
        // {
        //     iconImage = (icon.content as BitmapData).clone();
        // }
    }

    else if(category === FurniCategory.FLOOR)
    {
        // const icon = this._windowManager.assets.getAssetByName("inventory_furni_icon_floor");
        // if (icon != null)
        // {
        //     iconImage = (icon.content as BitmapData).clone();
        // }
    }

    else if(category === FurniCategory.LANDSCAPE)
    {
        // const icon = this._windowManager.assets.getAssetByName("inventory_furni_icon_landscape");
        // if (icon != null)
        // {
        //     iconImage = (icon.content as BitmapData).clone();
        // }
    }

    return new GroupItem(type, category, GetRoomEngine(), stuffData, extra);
}
