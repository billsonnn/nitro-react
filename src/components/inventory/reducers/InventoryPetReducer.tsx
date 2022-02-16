import { PetData } from '@nitrots/nitro-renderer';
import { Reducer } from 'react';
import { PetItem } from '../common/PetItem';
import { addSinglePetItem, processPetFragment, removePetItemById } from '../common/PetUtilities';
import { IUnseenItemTracker } from '../common/unseen/IUnseenItemTracker';

export interface IInventoryPetState
{
    needsPetUpdate: boolean;
    petItem: PetItem;
    petItems: PetItem[];
}

export interface IInventoryPetAction
{
    type: string;
    payload: {
        flag?: boolean;
        petItem?: PetItem;
        petId?: number;
        petData?: PetData;
        fragment?: Map<number, PetData>;
        unseenTracker?: IUnseenItemTracker;
    }
}

export class InventoryPetActions
{
    public static SET_NEEDS_UPDATE: string = 'IPA_SET_NEEDS_UPDATE';
    public static SET_PET_ITEM: string = 'IPA_SET_PET_ITEM';
    public static PROCESS_FRAGMENT: string = 'IPA_PROCESS_FRAGMENT';
    public static ADD_PET: string = 'IPA_ADD_PET';
    public static REMOVE_PET: string = 'IPA_REMOVE_PET';
}

export const initialInventoryPet: IInventoryPetState = {
    needsPetUpdate: true,
    petItem: null,
    petItems: []
}

export const InventoryPetReducer: Reducer<IInventoryPetState, IInventoryPetAction> = (state, action) =>
{
    switch(action.type)
    {
        case InventoryPetActions.SET_NEEDS_UPDATE:
            return { ...state, needsPetUpdate: (action.payload.flag || false) };
        case InventoryPetActions.SET_PET_ITEM: {
            let petItem = (action.payload.petItem || state.petItem || null);

            let index = 0;

            if(petItem)
            {
                const foundIndex = state.petItems.indexOf(petItem);

                if(foundIndex > -1) index = foundIndex;
            }

            petItem = (state.petItems[index] || null);

            return { ...state, petItem };
        }
        case InventoryPetActions.PROCESS_FRAGMENT: {
            const petItems = [ ...state.petItems ];

            processPetFragment(petItems, (action.payload.fragment || null), (action.payload.unseenTracker || null));

            return { ...state, petItems };
        }
        case InventoryPetActions.ADD_PET: {
            const petItems = [ ...state.petItems ];

            addSinglePetItem(action.payload.petData, petItems, true);

            return { ...state, petItems };
        }
        case InventoryPetActions.REMOVE_PET: {
            const petItems = [ ...state.petItems ];

            removePetItemById(action.payload.petId, petItems);

            return { ...state, petItems };
        }
        default:
            return state;
    }
}
