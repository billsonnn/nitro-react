import { AdvancedMap, BadgePointLimitsEvent, BadgeReceivedEvent, BadgesEvent, BotAddedToInventoryEvent, BotInventoryMessageEvent, BotRemovedFromInventoryEvent, FurnitureListAddOrUpdateEvent, FurnitureListEvent, FurnitureListInvalidateEvent, FurnitureListItemParser, FurnitureListRemovedEvent, FurniturePostItPlacedEvent, PetAddedToInventoryEvent, PetData, PetInventoryEvent, PetRemovedFromInventory, RequestBadgesComposer, TradingAcceptEvent, TradingCloseEvent, TradingCompletedEvent, TradingConfirmationEvent, TradingListItemEvent, TradingNotOpenEvent, TradingOpenEvent, TradingOpenFailedEvent, TradingOtherNotAllowedEvent, TradingYouAreNotAllowedEvent, UnseenItemsEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { GetLocalization, GetRoomSession, GetSessionDataManager, LocalizeText } from '../../api';
import { InventoryBadgesUpdatedEvent } from '../../events';
import { InventoryBadgesRequestEvent } from '../../events/inventory/InventoryBadgesRequestEvent';
import { dispatchUiEvent, useUiEvent } from '../../hooks';
import { CreateMessageHook, SendMessageHook } from '../../hooks/messages/message-event';
import { NotificationUtilities } from '../../views/notification-center/common/NotificationUtilities';
import { mergeFurniFragments } from './common/FurnitureUtilities';
import { mergePetFragments } from './common/PetUtilities';
import { TradeState } from './common/TradeState';
import { TradeUserData } from './common/TradeUserData';
import { useInventoryContext } from './InventoryContext';
import { InventoryBadgeActions } from './reducers/InventoryBadgeReducer';
import { InventoryBotActions } from './reducers/InventoryBotReducer';
import { InventoryFurnitureActions } from './reducers/InventoryFurnitureReducer';
import { InventoryPetActions } from './reducers/InventoryPetReducer';
let furniMsgFragments: Map<number, FurnitureListItemParser>[] = null;
let petMsgFragments: Map<number, PetData>[] = null;
 
export const InventoryMessageHandler: FC<{}> = props =>
{
    const { dispatchFurnitureState = null, dispatchBotState = null, dispatchPetState = null, badgeState = null, dispatchBadgeState = null, unseenTracker = null } = useInventoryContext();

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
            payload: { fragment, unseenTracker }
        });
    }, [ unseenTracker, dispatchFurnitureState ]);

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
            payload: { fragment, unseenTracker }
        });
    }, [ dispatchBotState, unseenTracker ]);

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
            payload: { fragment, unseenTracker }
        });
    }, [ dispatchPetState, unseenTracker ]);

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

    const onBadgeReceivedEvent = useCallback((event: BadgeReceivedEvent) =>
    {
        const parser = event.getParser();

        dispatchBadgeState({
            type: InventoryBadgeActions.ADD_BADGE,
            payload: {
                badgeCode: parser.badgeCode
            }
        });
    }, [ dispatchBadgeState ]);

    const onTradingAcceptEvent = useCallback((event: TradingAcceptEvent) =>
    {
        const parser = event.getParser();

        dispatchFurnitureState({
            type: InventoryFurnitureActions.SET_TRADE_ACCEPTANCE,
            payload: {
                userId: parser.userID,
                flag: parser.userAccepts
            }
        });
    }, [ dispatchFurnitureState ]);

    const onTradingCloseEvent = useCallback((event: TradingCloseEvent) =>
    {
        const parser = event.getParser();

        dispatchFurnitureState({
            type: InventoryFurnitureActions.CLOSE_TRADE,
            payload: {}
        });
    }, [ dispatchFurnitureState ]);

    const onTradingCompletedEvent = useCallback((event: TradingCompletedEvent) =>
    {
        const parser = event.getParser();

        dispatchFurnitureState({
            type: InventoryFurnitureActions.CLOSE_TRADE,
            payload: {}
        });
    }, [ dispatchFurnitureState ]);

    const onTradingConfirmationEvent = useCallback((event: TradingConfirmationEvent) =>
    {
        const parser = event.getParser();

        dispatchFurnitureState({
            type: InventoryFurnitureActions.SET_TRADE_STATE,
            payload: {
                tradeState: TradeState.TRADING_STATE_COUNTDOWN
            }
        });
    }, [ dispatchFurnitureState ]);

    const onTradingListItemEvent = useCallback((event: TradingListItemEvent) =>
    {
        const parser = event.getParser();

        dispatchFurnitureState({
            type: InventoryFurnitureActions.UPDATE_TRADE,
            payload: {
                tradeParser: event.getParser()
            }
        });
    }, [ dispatchFurnitureState ]);

    const onTradingNotOpenEvent = useCallback((event: TradingNotOpenEvent) =>
    {
        const parser = event.getParser();

        console.log(parser);
    }, []);

    const onTradingOpenEvent = useCallback((event: TradingOpenEvent) =>
    {
        const parser = event.getParser();

        const ownUser = new TradeUserData();
        const otherUser = new TradeUserData();

        ownUser.userItems = new AdvancedMap();
        otherUser.userItems = new AdvancedMap();
        
        const userDataOne = GetRoomSession().userDataManager.getUserData(parser.userID);
        const userDataTwo = GetRoomSession().userDataManager.getUserData(parser.otherUserID);

        if(userDataOne.webID === GetSessionDataManager().userId)
        {
            ownUser.userId = userDataOne.webID;
            ownUser.userName = userDataOne.name;
            ownUser.canTrade = parser.userCanTrade;

            otherUser.userId = userDataTwo.webID;
            otherUser.userName = userDataTwo.name;
            otherUser.canTrade = parser.otherUserCanTrade;
        }

        else if(userDataTwo.webID === GetSessionDataManager().userId)
        {
            ownUser.userId = userDataTwo.webID;
            ownUser.userName = userDataTwo.name;
            ownUser.canTrade = parser.otherUserCanTrade;

            otherUser.userId = userDataOne.webID;
            otherUser.userName = userDataOne.name;
            otherUser.canTrade = parser.userCanTrade;
        }

        dispatchFurnitureState({
            type: InventoryFurnitureActions.SET_TRADE_DATA,
            payload: {
                ownTradeUser: ownUser,
                otherTradeUser: otherUser
            }
        });
    }, [ dispatchFurnitureState ]);

    const onTradingOpenFailedEvent = useCallback((event: TradingOpenFailedEvent) =>
    {
        const parser = event.getParser();

        NotificationUtilities.simpleAlert(LocalizeText(`inventory.trading.openfail.${ parser.reason }`, [ 'otherusername' ], [ parser.otherUserName ]), null, null, null, LocalizeText('inventory.trading.openfail.title'));
    }, []);

    const onTradingOtherNotAllowedEvent = useCallback((event: TradingOtherNotAllowedEvent) =>
    {
        const parser = event.getParser();

        console.log(parser);
    }, []);

    const onTradingYouAreNotAllowedEvent = useCallback((event: TradingYouAreNotAllowedEvent) =>
    {
        const parser = event.getParser();

        console.log(parser);
    }, []);

    const onUnseenItemsEvent = useCallback((event: UnseenItemsEvent) =>
    {
        const parser = event.getParser();

        for(const category of parser.categories)
        {
            const itemIds = parser.getItemsByCategory(category);

            unseenTracker.addItems(category, itemIds);
        }
    }, [ unseenTracker ]);

    const onBadgePointLimitsEvent = useCallback((event: BadgePointLimitsEvent) =>
    {
        const parser = event.getParser();

        for(const data of parser.data) GetLocalization().setBadgePointLimit(data.badgeId, data.limit);
    }, []);

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
    CreateMessageHook(BadgeReceivedEvent, onBadgeReceivedEvent);
    CreateMessageHook(TradingAcceptEvent, onTradingAcceptEvent);
    CreateMessageHook(TradingCloseEvent, onTradingCloseEvent);
    CreateMessageHook(TradingCompletedEvent, onTradingCompletedEvent);
    CreateMessageHook(TradingConfirmationEvent, onTradingConfirmationEvent);
    CreateMessageHook(TradingListItemEvent, onTradingListItemEvent);
    CreateMessageHook(TradingNotOpenEvent, onTradingNotOpenEvent);
    CreateMessageHook(TradingOpenEvent, onTradingOpenEvent);
    CreateMessageHook(TradingOpenFailedEvent, onTradingOpenFailedEvent);
    CreateMessageHook(TradingOtherNotAllowedEvent, onTradingOtherNotAllowedEvent);
    CreateMessageHook(TradingYouAreNotAllowedEvent, onTradingYouAreNotAllowedEvent);
    CreateMessageHook(UnseenItemsEvent, onUnseenItemsEvent);
    CreateMessageHook(BadgePointLimitsEvent, onBadgePointLimitsEvent);

    const onInventoryBadgesRequestEvent = useCallback((event: InventoryBadgesRequestEvent) =>
    {
        if(badgeState.needsBadgeUpdate)
        {
            SendMessageHook(new RequestBadgesComposer());

            return;
        }

        dispatchUiEvent(new InventoryBadgesUpdatedEvent(InventoryBadgesUpdatedEvent.BADGES_UPDATED, badgeState.badges));
    }, [ badgeState ])

    useUiEvent(InventoryBadgesRequestEvent.REQUEST_BADGES, onInventoryBadgesRequestEvent);

    return null;
}
