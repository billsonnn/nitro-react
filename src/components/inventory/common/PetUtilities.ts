import { PetData, RoomObjectCategory, RoomObjectPlacementSource, RoomObjectType } from '@nitrots/nitro-renderer';
import { GetRoomEngine, GetRoomSessionManager } from '../../../api';
import { InventoryEvent } from '../../../events';
import { dispatchUiEvent } from '../../../hooks/events/ui/ui-event';
import { getPlacingItemId, setObjectMoverRequested, setPlacingItemId } from './InventoryUtilities';
import { PetItem } from './PetItem';
import { IUnseenItemTracker } from './unseen/IUnseenItemTracker';
import { UnseenItemCategory } from './unseen/UnseenItemCategory';

export function cancelRoomObjectPlacement(): void
{
    if(getPlacingItemId() === -1) return;
    
    GetRoomEngine().cancelRoomObjectPlacement();

    setPlacingItemId(-1);
    setObjectMoverRequested(false);
}

export function attemptPetPlacement(petItem: PetItem, flag: boolean = false): boolean
{
    const petData = petItem.petData;

    if(!petData) return false;

    const session = GetRoomSessionManager().getSession(1);

    if(!session) return false;

    if(!session.isRoomOwner)
    {
        if(!session.allowPets) return false;
    }

    dispatchUiEvent(new InventoryEvent(InventoryEvent.HIDE_INVENTORY));

    if(GetRoomEngine().processRoomObjectPlacement(RoomObjectPlacementSource.INVENTORY, -(petData.id), RoomObjectCategory.UNIT, RoomObjectType.PET, petData.figureData.figuredata))
    {
        setPlacingItemId(petData.id);
        setObjectMoverRequested(true);
    }

    return true;
}

export function mergePetFragments(fragment: Map<number, PetData>, totalFragments: number, fragmentNumber: number, fragments: Map<number, PetData>[])
{
    if(totalFragments === 1) return fragment;

    fragments[fragmentNumber] = fragment;

    for(const frag of fragments)
    {
        if(!frag) return null;
    }

    const merged: Map<number, PetData> = new Map();

    for(const frag of fragments)
    {
        for(const [ key, value ] of frag) merged.set(key, value);

        frag.clear();
    }

    fragments = null;

    return merged;
}

function getAllItemIds(petItems: PetItem[]): number[]
{
    const itemIds: number[] = [];

    for(const petItem of petItems) itemIds.push(petItem.id);

    return itemIds;
}

export function processPetFragment(set: PetItem[], fragment: Map<number, PetData>, unseenTracker: IUnseenItemTracker): PetItem[]
{
    const existingIds = getAllItemIds(set);
    const addedIds: number[] = [];
    const removedIds: number[] = [];

    for(const key of fragment.keys()) (existingIds.indexOf(key) === -1) && addedIds.push(key);

    for(const itemId of existingIds) (!fragment.get(itemId)) && removedIds.push(itemId);

    const emptyExistingSet = (existingIds.length === 0);

    for(const id of removedIds) removePetItemById(id, set);

    for(const id of addedIds)
    {
        const parser = fragment.get(id);

        if(!parser) continue;

        addSinglePetItem(parser, set, unseenTracker.isUnseen(UnseenItemCategory.PET, parser.id));
    }

    return set;
}

export function removePetItemById(id: number, set: PetItem[]): PetItem
{
    let index = 0;

    while(index < set.length)
    {
        const petItem = set[index];

        if(petItem && (petItem.id === id))
        {
            if(getPlacingItemId() === petItem.id)
            {
                cancelRoomObjectPlacement();
                
                setTimeout(() => dispatchUiEvent(new InventoryEvent(InventoryEvent.SHOW_INVENTORY)), 1);
            }
            
            set.splice(index, 1);

            return petItem;
        }

        index++;
    }

    return null;
}

export function addSinglePetItem(petData: PetData, set: PetItem[], unseen: boolean = true): PetItem
{
    const petItem = new PetItem(petData);

    if(unseen)
    {
        petItem.isUnseen = true;
        
        set.unshift(petItem);
    }
    else
    {
        set.push(petItem);
    }

    return petItem;
}
