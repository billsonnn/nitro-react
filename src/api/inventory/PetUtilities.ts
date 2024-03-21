import { CreateLinkEvent, PetData } from '@nitrots/nitro-renderer';
import { IPetItem } from './IPetItem';
import { cancelRoomObjectPlacement, getPlacingItemId } from './InventoryUtilities';
import { UnseenItemCategory } from './UnseenItemCategory';

export const getAllPetIds = (petItems: IPetItem[]) => petItems.map(item => item.petData.id);

export const addSinglePetItem = (petData: PetData, set: IPetItem[], unseen: boolean = true) =>
{
    const petItem = { petData };

    if(unseen)
    {
        //petItem.isUnseen = true;
        
        set.unshift(petItem);
    }
    else
    {
        set.push(petItem);
    }

    return petItem;
}

export const removePetItemById = (id: number, set: IPetItem[]) =>
{
    let index = 0;

    while(index < set.length)
    {
        const petItem = set[index];

        if(petItem && (petItem.petData.id === id))
        {
            if(getPlacingItemId() === petItem.petData.id)
            {
                cancelRoomObjectPlacement();

                CreateLinkEvent('inventory/open');
            }
            
            set.splice(index, 1);

            return petItem;
        }

        index++;
    }

    return null;
}

export const processPetFragment = (set: IPetItem[], fragment: Map<number, PetData>, isUnseen: (category: number, itemId: number) => boolean) =>
{
    const existingIds = getAllPetIds(set);
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

        addSinglePetItem(parser, set, isUnseen(UnseenItemCategory.PET, parser.id));
    }

    return set;
}

export const mergePetFragments = (fragment: Map<number, PetData>, totalFragments: number, fragmentNumber: number, fragments: Map<number, PetData>[]) =>
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
