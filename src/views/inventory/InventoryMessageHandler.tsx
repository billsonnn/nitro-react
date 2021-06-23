import { BadgesEvent, BotAddedToInventoryEvent, BotInventoryMessageEvent, BotRemovedFromInventoryEvent, FurnitureListAddOrUpdateEvent, FurnitureListEvent, FurnitureListInvalidateEvent, FurnitureListItemParser, FurnitureListRemovedEvent, FurniturePostItPlacedEvent, PetAddedToInventoryEvent, PetData, PetInventoryEvent, PetRemovedFromInventory } from 'nitro-renderer';
import { FC, useCallback } from 'react';
import { CreateMessageHook } from '../../hooks/messages/message-event';
import { mergeFurniFragments } from './common/FurnitureUtilities';
import { mergePetFragments } from './common/PetUtilities';
import { useInventoryContext } from './context/InventoryContext';
import { InventoryMessageHandlerProps } from './InventoryMessageHandler.types';
import { InventoryBadgeActions } from './reducers/InventoryBadgeReducer';
import { InventoryBotActions } from './reducers/InventoryBotReducer';
import { InventoryFurnitureActions } from './reducers/InventoryFurnitureReducer';
import { InventoryPetActions } from './reducers/InventoryPetReducer';

let furniMsgFragments: Map<number, FurnitureListItemParser>[] = null;
let petMsgFragments: Map<number, PetData>[] = null;
 
export const InventoryMessageHandler: FC<InventoryMessageHandlerProps> = props =>
{
    const { dispatchFurnitureState = null, dispatchBotState = null, dispatchPetState = null, dispatchBadgeState = null } = useInventoryContext();

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

        const fragment = mergeFurniFragments(parser.fragment, parser.totalFragments, parser.fragmentNumber, furniMsgFragments);

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

    const onBotInventoryMessageEvent = useCallback((event: BotInventoryMessageEvent) =>
    {
        const parser = event.getParser();

        const fragment = Array.from(parser.items.values());

        dispatchBotState({
            type: InventoryBotActions.PROCESS_FRAGMENT,
            payload: { fragment }
        });
    }, [ dispatchBotState ]);

    const onBotAddedToInventoryEvent = useCallback((event: BotAddedToInventoryEvent) =>
    {
        const parser = event.getParser();

        dispatchBotState({
            type: InventoryBotActions.ADD_BOT,
            payload: {
                botData: parser.item
            }
        });
    }, [ dispatchBotState ]);

    const onBotRemovedFromInventoryEvent = useCallback((event: BotRemovedFromInventoryEvent) =>
    {
        const parser = event.getParser();

        dispatchBotState({
            type: InventoryBotActions.REMOVE_BOT,
            payload: {
                botId: parser.itemId
            }
        });
    }, [ dispatchBotState ]);

    const onPetInventoryEvent = useCallback((event: PetInventoryEvent) =>
    {
        const parser = event.getParser();

        if(!petMsgFragments) petMsgFragments = new Array(parser.totalFragments);

        const fragment = mergePetFragments(parser.fragment, parser.totalFragments, parser.fragmentNumber, petMsgFragments);

        if(!fragment) return;

        dispatchPetState({
            type: InventoryPetActions.PROCESS_FRAGMENT,
            payload: { fragment }
        });
    }, [dispatchPetState ]);

    const onPetAddedToInventoryEvent = useCallback((event: PetAddedToInventoryEvent) =>
    {
        const parser = event.getParser();

        dispatchPetState({
            type: InventoryPetActions.ADD_PET,
            payload: {
                petData: parser.pet
            }
        });
    }, [ dispatchPetState ]);

    const onPetRemovedFromInventory = useCallback((event: PetRemovedFromInventory) =>
    {
        const parser = event.getParser();

        dispatchPetState({
            type: InventoryPetActions.REMOVE_PET,
            payload: {
                petId: parser.petId
            }
        });
    }, [ dispatchPetState ]);

    const onBadgesEvent = useCallback((event: BadgesEvent) =>
    {
        const parser = event.getParser();

        dispatchBadgeState({
            type: InventoryBadgeActions.SET_BADGES,
            payload: {
                badgeCodes: parser.getAllBadgeCodes(),
                activeBadgeCodes: parser.getActiveBadgeCodes()
            }
        });
    }, [ dispatchBadgeState ]);

    CreateMessageHook(FurnitureListAddOrUpdateEvent, onFurnitureListAddOrUpdateEvent);
    CreateMessageHook(FurnitureListEvent, onFurnitureListEvent);
    CreateMessageHook(FurnitureListInvalidateEvent, onFurnitureListInvalidateEvent);
    CreateMessageHook(FurnitureListRemovedEvent, onFurnitureListRemovedEvent);
    CreateMessageHook(FurniturePostItPlacedEvent, onFurniturePostItPlacedEvent);
    CreateMessageHook(BotInventoryMessageEvent, onBotInventoryMessageEvent);
    CreateMessageHook(BotRemovedFromInventoryEvent, onBotRemovedFromInventoryEvent);
    CreateMessageHook(BotAddedToInventoryEvent, onBotAddedToInventoryEvent);
    CreateMessageHook(PetInventoryEvent, onPetInventoryEvent);
    CreateMessageHook(PetRemovedFromInventory, onPetRemovedFromInventory);
    CreateMessageHook(PetAddedToInventoryEvent, onPetAddedToInventoryEvent);
    CreateMessageHook(BadgesEvent, onBadgesEvent);

    return null;
}
