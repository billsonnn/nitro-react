import { BotData, RoomObjectCategory, RoomObjectPlacementSource, RoomObjectType } from '@nitrots/nitro-renderer';
import { GetRoomEngine, GetRoomSessionManager } from '../../../api';
import { InventoryEvent } from '../../../events';
import { dispatchUiEvent } from '../../../hooks/events/ui/ui-event';
import { BotItem } from './BotItem';
import { getPlacingItemId, setObjectMoverRequested, setPlacingItemId } from './InventoryUtilities';
import { IUnseenItemTracker } from './unseen/IUnseenItemTracker';
import { UnseenItemCategory } from './unseen/UnseenItemCategory';

export function cancelRoomObjectPlacement(): void
{
    if(getPlacingItemId() === -1) return;
    
    GetRoomEngine().cancelRoomObjectPlacement();

    setPlacingItemId(-1);
    setObjectMoverRequested(false);
}

export function attemptBotPlacement(botItem: BotItem, flag: boolean = false): boolean
{
    const botData = botItem.botData;

    if(!botData) return false;

    const session = GetRoomSessionManager().getSession(1);

    if(!session || !session.isRoomOwner) return false;

    dispatchUiEvent(new InventoryEvent(InventoryEvent.HIDE_INVENTORY));

    if(GetRoomEngine().processRoomObjectPlacement(RoomObjectPlacementSource.INVENTORY, -(botData.id), RoomObjectCategory.UNIT, RoomObjectType.RENTABLE_BOT, botData.figure))
    {
        setPlacingItemId(botData.id);
        setObjectMoverRequested(true);
    }

    return true;
}

function getAllItemIds(botItems: BotItem[]): number[]
{
    const itemIds: number[] = [];

    for(const botItem of botItems) itemIds.push(botItem.id);

    return itemIds;
}

export function processBotFragment(set: BotItem[], fragment: BotData[], unseenTracker: IUnseenItemTracker): BotItem[]
{
    const existingIds = getAllItemIds(set);
    const addedDatas: BotData[] = [];
    const removedIds: number[] = [];

    for(const botData of fragment) (existingIds.indexOf(botData.id) === -1) && addedDatas.push(botData);

    for(const itemId of existingIds)
    {
        let remove = true;

        for(const botData of fragment)
        {
            if(botData.id === itemId)
            {
                remove = false;

                break;
            }
        }

        if(remove) removedIds.push(itemId);
    }

    const emptyExistingSet = (existingIds.length === 0);

    for(const id of removedIds) removeBotItemById(id, set);

    for(const botData of addedDatas)
    {
        addSingleBotItem(botData, set, unseenTracker.isUnseen(UnseenItemCategory.BOT, botData.id));
    }

    return set;
}

export function removeBotItemById(id: number, set: BotItem[]): BotItem
{
    let index = 0;

    while(index < set.length)
    {
        const botItem = set[index];

        if(botItem && (botItem.id === id))
        {
            if(getPlacingItemId() === botItem.id)
            {
                cancelRoomObjectPlacement();
                
                setTimeout(() => dispatchUiEvent(new InventoryEvent(InventoryEvent.SHOW_INVENTORY)), 1);
            }
            
            set.splice(index, 1);

            return botItem;
        }

        index++;
    }

    return null;
}

export function addSingleBotItem(botData: BotData, set: BotItem[], unseen: boolean = true): BotItem
{
    const botItem = new BotItem(botData);

    if(unseen)
    {
        botItem.isUnseen = true;

        set.unshift(botItem);
    }
    else
    {
        set.push(botItem);
    }

    return botItem;
}
