import { PetAddedToInventoryEvent, PetData, PetInventoryEvent, PetRemovedFromInventory, RequestPetsComposer } from '@nitrots/nitro-renderer';
import { useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { addSinglePetItem, IPetItem, mergePetFragments, processPetFragment, removePetItemById, SendMessageComposer, UnseenItemCategory } from '../../api';
import { useMessageEvent } from '../events';
import { useSharedVisibility } from '../useSharedVisibility';
import { useInventoryUnseenTracker } from './useInventoryUnseenTracker';

let petMsgFragments: Map<number, PetData>[] = null;

const useInventoryPetsState = () =>
{
    const [ needsUpdate, setNeedsUpdate ] = useState(true);
    const [ petItems, setPetItems ] = useState<IPetItem[]>([]);
    const [ selectedPet, setSelectedPet ] = useState<IPetItem>(null);
    const { isVisible = false, activate = null, deactivate = null } = useSharedVisibility();
    const { isUnseen = null, resetCategory = null } = useInventoryUnseenTracker();

    useMessageEvent<PetInventoryEvent>(PetInventoryEvent, event =>
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
    });

    useMessageEvent<PetAddedToInventoryEvent>(PetAddedToInventoryEvent, event =>
    {
        const parser = event.getParser();

        setPetItems(prevValue =>
        {
            const newValue = [ ...prevValue ];

            addSinglePetItem(parser.pet, newValue, isUnseen(UnseenItemCategory.PET, parser.pet.id));

            return newValue;
        });
    });

    useMessageEvent<PetRemovedFromInventory>(PetRemovedFromInventory, event =>
    {
        const parser = event.getParser();

        setPetItems(prevValue =>
        {
            const newValue = [ ...prevValue ];

            removePetItemById(parser.petId, newValue);

            return newValue;
        });
    });

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
        };
    }, [ isVisible, resetCategory ]);

    useEffect(() =>
    {
        if(!isVisible || !needsUpdate) return;

        SendMessageComposer(new RequestPetsComposer());

        setNeedsUpdate(false);
    }, [ isVisible, needsUpdate ]);

    return { petItems, selectedPet, setSelectedPet, activate, deactivate };
};

export const useInventoryPets = () => useBetween(useInventoryPetsState);
