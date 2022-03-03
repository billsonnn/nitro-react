import { IRoomSession, RoomEngineObjectEvent, RoomEngineObjectPlacedEvent, RoomPreviewer, RoomSessionEvent, TradingCancelComposer, TradingCloseComposer, TradingOpenComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { GetRoomEngine, LocalizeText, SendMessageComposer } from '../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../common';
import { InventoryBadgesUpdatedEvent, InventoryEvent, InventoryTradeRequestEvent } from '../../events';
import { DispatchUiEvent, UseRoomEngineEvent, UseRoomSessionManagerEvent, UseUiEvent } from '../../hooks';
import { isObjectMoverRequested, setObjectMoverRequested } from './common/InventoryUtilities';
import { TradeState } from './common/TradeState';
import { IUnseenItemTracker } from './common/unseen/IUnseenItemTracker';
import { UnseenItemCategory } from './common/unseen/UnseenItemCategory';
import { UnseenItemTracker } from './common/unseen/UnseenItemTracker';
import { InventoryContextProvider } from './InventoryContext';
import { InventoryMessageHandler } from './InventoryMessageHandler';
import { initialInventoryBadge, InventoryBadgeReducer } from './reducers/InventoryBadgeReducer';
import { initialInventoryBot, InventoryBotReducer } from './reducers/InventoryBotReducer';
import { initialInventoryFurniture, InventoryFurnitureReducer } from './reducers/InventoryFurnitureReducer';
import { initialInventoryPet, InventoryPetReducer } from './reducers/InventoryPetReducer';
import { InventoryBadgeView } from './views/badge/InventoryBadgeView';
import { InventoryBotView } from './views/bot/InventoryBotView';
import { InventoryFurnitureView } from './views/furniture/InventoryFurnitureView';
import { InventoryPetView } from './views/pet/InventoryPetView';
import { InventoryTradeView } from './views/trade/InventoryTradeView';

const TAB_FURNITURE: string = 'inventory.furni';
const TAB_BOTS: string = 'inventory.bots';
const TAB_PETS: string = 'inventory.furni.tab.pets';
const TAB_BADGES: string = 'inventory.badges';
const TABS = [ TAB_FURNITURE, TAB_BOTS, TAB_PETS, TAB_BADGES ];
const UNSEEN_CATEGORIES = [ UnseenItemCategory.FURNI, UnseenItemCategory.BOT, UnseenItemCategory.PET, UnseenItemCategory.BADGE ];

export const InventoryView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ]   = useState(false);
    const [ currentTab, setCurrentTab ] = useState<string>(TABS[0]);
    const [ roomSession, setRoomSession ] = useState<IRoomSession>(null);
    const [ roomPreviewer, setRoomPreviewer ] = useState<RoomPreviewer>(null);
    const [ furnitureState, dispatchFurnitureState ] = useReducer(InventoryFurnitureReducer, initialInventoryFurniture);
    const [ botState, dispatchBotState ] = useReducer(InventoryBotReducer, initialInventoryBot);
    const [ petState, dispatchPetState ] = useReducer(InventoryPetReducer, initialInventoryPet);
    const [ badgeState, dispatchBadgeState ] = useReducer(InventoryBadgeReducer, initialInventoryBadge);
    const [ unseenTracker ] = useState<IUnseenItemTracker>(new UnseenItemTracker());

    const close = useCallback(() =>
    {
        if(furnitureState.tradeData)
        {
            switch(furnitureState.tradeData.state)
            {
                case TradeState.TRADING_STATE_RUNNING:
                    SendMessageComposer(new TradingCloseComposer());
                    return;
                default:
                    SendMessageComposer(new TradingCancelComposer());
                    return;
            }
        }
        
        setIsVisible(false);
    }, [ furnitureState.tradeData ]);

    const onInventoryEvent = useCallback((event: InventoryEvent) =>
    {
        switch(event.type)
        {
            case InventoryEvent.SHOW_INVENTORY:
                if(isVisible) return;

                setIsVisible(true);
                return;
            case InventoryEvent.HIDE_INVENTORY:
                if(!isVisible) return;

                close();
                return;
            case InventoryEvent.TOGGLE_INVENTORY:
                if(!isVisible)
                {
                    setIsVisible(true);
                }
                else
                {
                    close();
                }
                return;
            case InventoryTradeRequestEvent.REQUEST_TRADE: {
                const tradeEvent = (event as InventoryTradeRequestEvent);

                SendMessageComposer(new TradingOpenComposer(tradeEvent.objectId));
            }
        }
    }, [ isVisible, close ]);

    UseUiEvent(InventoryEvent.SHOW_INVENTORY, onInventoryEvent);
    UseUiEvent(InventoryEvent.HIDE_INVENTORY, onInventoryEvent);
    UseUiEvent(InventoryEvent.TOGGLE_INVENTORY, onInventoryEvent);
    UseUiEvent(InventoryTradeRequestEvent.REQUEST_TRADE, onInventoryEvent);

    const onRoomEngineObjectPlacedEvent = useCallback((event: RoomEngineObjectPlacedEvent) =>
    {
        if(!isObjectMoverRequested()) return;

        setObjectMoverRequested(false);

        if(!event.placedInRoom) setIsVisible(true);
    }, []);

    UseRoomEngineEvent(RoomEngineObjectEvent.PLACED, onRoomEngineObjectPlacedEvent);

    const onRoomSessionEvent = useCallback((event: RoomSessionEvent) =>
    {
        switch(event.type)
        {
            case RoomSessionEvent.CREATED:
                setRoomSession(event.session);
                return;
            case RoomSessionEvent.ENDED:
                setRoomSession(null);
                setIsVisible(false);
                return;
        }
    }, []);

    UseRoomSessionManagerEvent(RoomSessionEvent.CREATED, onRoomSessionEvent);
    UseRoomSessionManagerEvent(RoomSessionEvent.ENDED, onRoomSessionEvent);

    const resetTrackerForTab = useCallback((name: string) =>
    {
        const tabIndex = TABS.indexOf(name);

        if(tabIndex === -1) return;

        const unseenCategory = UNSEEN_CATEGORIES[tabIndex];

        if(unseenCategory === -1) return;

        const count = unseenTracker.getCount(unseenCategory);

        if(!count) return;

        unseenTracker.resetCategory(unseenCategory);

        switch(unseenCategory)
        {
            case UnseenItemCategory.FURNI:
                for(const groupItem of furnitureState.groupItems) groupItem.hasUnseenItems = false;

                return;
        }
    }, [ furnitureState.groupItems, unseenTracker ]);

    const switchTab = (prevTab: string, nextTab: string) =>
    {
        if(nextTab) setCurrentTab(nextTab);

        resetTrackerForTab(prevTab);
    }

    useEffect(() =>
    {
        if(isVisible) return;

        if(currentTab) resetTrackerForTab(currentTab);
    }, [ currentTab, isVisible, resetTrackerForTab ]);

    useEffect(() =>
    {
        setRoomPreviewer(new RoomPreviewer(GetRoomEngine(), ++RoomPreviewer.PREVIEW_COUNTER));

        return () =>
        {
            setRoomPreviewer(prevValue =>
                {
                    prevValue.dispose();

                    return null;
                });
        }
    }, []);

    useEffect(() =>
    {
        if(!isVisible)
        {
            if(furnitureState.tradeData) setIsVisible(true);
        }
    }, [ furnitureState.tradeData, isVisible ]);

    useEffect(() =>
    {
        if(!badgeState.badges) return;
        
        DispatchUiEvent(new InventoryBadgesUpdatedEvent(InventoryBadgesUpdatedEvent.BADGES_UPDATED, badgeState.badges));
    }, [ badgeState.badges ]);

    return (
        <InventoryContextProvider value={ { furnitureState, dispatchFurnitureState, botState, dispatchBotState, petState, dispatchPetState, badgeState, dispatchBadgeState, unseenTracker } }>
            <InventoryMessageHandler />
            { isVisible &&
                <NitroCardView uniqueKey={ 'inventory' } className="nitro-inventory">
                    <NitroCardHeaderView headerText={ LocalizeText('inventory.title') } onCloseClick={ close } />
                    { !furnitureState.tradeData &&
                        <>
                            <NitroCardTabsView>
                                { TABS.map((name, index) =>
                                    {
                                        const unseenCount = unseenTracker.getCount(UNSEEN_CATEGORIES[index]);

                                        return (
                                            <NitroCardTabsItemView key={ index } isActive={ (currentTab === name) } onClick={ event => switchTab(currentTab, name) } count={ unseenCount }>
                                                { LocalizeText(name) }
                                            </NitroCardTabsItemView>
                                        );
                                    }) }
                            </NitroCardTabsView>
                            <NitroCardContentView>
                                { (currentTab === TAB_FURNITURE ) &&
                                    <InventoryFurnitureView roomSession={ roomSession } roomPreviewer={ roomPreviewer } /> }
                                { (currentTab === TAB_BOTS ) &&
                                    <InventoryBotView roomSession={ roomSession } roomPreviewer={ roomPreviewer } /> }
                                { (currentTab === TAB_PETS ) && 
                                    <InventoryPetView roomSession={ roomSession } roomPreviewer={ roomPreviewer } /> }
                                { (currentTab === TAB_BADGES ) && 
                                    <InventoryBadgeView /> }
                            </NitroCardContentView>
                        </> }
                    { furnitureState.tradeData &&
                        <NitroCardContentView>
                            <InventoryTradeView cancelTrade={ close } />
                        </NitroCardContentView> }
                </NitroCardView> }
        </InventoryContextProvider>
    );
}
