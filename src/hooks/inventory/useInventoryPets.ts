import { PetAddedToInventoryEvent, PetData, PetInventoryEvent, PetRemovedFromInventory, RequestPetsComposer } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { useInventoryUnseenTracker } from '.';
import { UseMessageEventHook } from '..';
import { addSinglePetItem, IPetItem, mergePetFragments, processPetFragment, removePetItemById, SendMessageComposer, UnseenItemCategory } from '../../api';
import { useSharedVisibility } from '../useSharedVisibility';

let petMsgFragments: Map<number, PetData>[] = null;

const useInventoryPetsState = () =>
{
    const [ needsUpdate, setNeedsUpdate ] = useState(true);
    const [ petItems, setPetItems ] = useState<IPetItem[]>([]);
    const [ selectedPet, setSelectedPet ] = useState<IPetItem>(null);
    const { isVisible = false, activate = null, deactivate = null } = useSharedVisibility();
    const { isUnseen = null, resetCategory = null } = useInventoryUnseenTracker();

    const onPetInventoryEvent = useCallback((event: PetInventoryEvent) =>
    {
        const parser = event.getParser();

        if(!petMsgFragments) petMsgFragments = new Array(parser.totalFragments);

        const fragment = mergePetFragments(parser.fragment, parser.totalFragments, parser.fragmentNumber, petMsgFragments);

        if(!fragment) return;

        setPetItems(prevValue =>
        {
            const newValue = [ ...prevValue ];

            processPetFragment(newValue, fragment, isUnseen);

            return newValue;
        });

        petMsgFragments = null;
    }, [ isUnseen ]);

    UseMessageEventHook(PetInventoryEvent, onPetInventoryEvent);

    const onPetAddedToInventoryEvent = useCallback((event: PetAddedToInventoryEvent) =>
    {
        const parser = event.getParser();

        setPetItems(prevValue =>
        {
            const newValue = [ ...prevValue ];

            addSinglePetItem(parser.pet, newValue, isUnseen(UnseenItemCategory.PET, parser.pet.id));

            return newValue;
        });
    }, [ isUnseen ]);

    UseMessageEventHook(PetAddedToInventoryEvent, onPetAddedToInventoryEvent);

    const onPetRemovedFromInventory = useCallback((event: PetRemovedFromInventory) =>
    {
        const parser = event.getParser();

        setPetItems(prevValue =>
        {
            const newValue = [ ...prevValue ];

            removePetItemById(parser.petId, newValue);

            return newValue;
        });
    }, []);

    UseMessageEventHook(PetRemovedFromInventory, onPetRemovedFromInventory);

    useEffect(() =>
    {
        if(!petItems || !petItems.length) return;

        setSelectedPet(prevValue =>
        {
            let newValue = prevValue;

            if(newValue && (petItems.indexOf(newValue) === -1)) newValue = null;

            if(!newValue) newValue = petItems[0];

            return newValue;
        });
    }, [ petItems ]);

    useEffect(() =>
    {
        if(!isVisible) return;

        return () =>
        {
            resetCategory(UnseenItemCategory.PET);
        }
    }, [ isVisible, resetCategory ]);

    useEffect(() =>
    {
        if(!isVisible || !needsUpdate) return;

        SendMessageComposer(new RequestPetsComposer());

        setNeedsUpdate(false);
    }, [ isVisible, needsUpdate ]);

    return { petItems, selectedPet, setSelectedPet, activate, deactivate };
}

export const useInventoryPets = () => useBetween(useInventoryPetsState);
