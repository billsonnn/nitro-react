import { IRoomSession, RoomEngineObjectEvent, RoomEngineObjectPlacedEvent, RoomPreviewer, RoomSessionEvent, TradingCancelComposer, TradingCloseComposer, TradingOpenComposer } from 'nitro-renderer';
import { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { GetConnection, GetRoomEngine } from '../../api';
import { InventoryEvent, InventoryTradeRequestEvent } from '../../events';
import { useRoomEngineEvent } from '../../hooks/events/nitro/room/room-engine-event';
import { useRoomSessionManagerEvent } from '../../hooks/events/nitro/session/room-session-manager-event';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../hooks/messages';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../layout';
import { LocalizeText } from '../../utils/LocalizeText';
import { isObjectMoverRequested, setObjectMoverRequested } from './common/InventoryUtilities';
import { TradeState } from './common/TradeState';
import { InventoryContextProvider } from './context/InventoryContext';
import { InventoryMessageHandler } from './InventoryMessageHandler';
import { InventoryTabs, InventoryViewProps } from './InventoryView.types';
import { initialInventoryBadge, InventoryBadgeReducer } from './reducers/InventoryBadgeReducer';
import { initialInventoryBot, InventoryBotReducer } from './reducers/InventoryBotReducer';
import { initialInventoryFurniture, InventoryFurnitureReducer } from './reducers/InventoryFurnitureReducer';
import { initialInventoryPet, InventoryPetReducer } from './reducers/InventoryPetReducer';
import { InventoryBadgeView } from './views/badge/InventoryBadgeView';
import { InventoryBotView } from './views/bot/InventoryBotView';
import { InventoryFurnitureView } from './views/furniture/InventoryFurnitureView';
import { InventoryPetView } from './views/pet/InventoryPetView';
import { InventoryTradeView } from './views/trade/InventoryTradeView';

const tabs = [ InventoryTabs.FURNITURE, InventoryTabs.BOTS, InventoryTabs.PETS, InventoryTabs.BADGES ];

export const InventoryView: FC<InventoryViewProps> = props =>
{
    const [ isVisible, setIsVisible ]   = useState(false);
    const [ currentTab, setCurrentTab ] = useState<string>(tabs[0]);
    const [ roomSession, setRoomSession ] = useState<IRoomSession>(null);
    const [ roomPreviewer, setRoomPreviewer ] = useState<RoomPreviewer>(null);
    const [ furnitureState, dispatchFurnitureState ] = useReducer(InventoryFurnitureReducer, initialInventoryFurniture);
    const [ botState, dispatchBotState ] = useReducer(InventoryBotReducer, initialInventoryBot);
    const [ petState, dispatchPetState ] = useReducer(InventoryPetReducer, initialInventoryPet);
    const [ badgeState, dispatchBadgeState ] = useReducer(InventoryBadgeReducer, initialInventoryBadge);

    const close = useCallback(() =>
    {
        if(furnitureState.tradeData)
        {
            switch(furnitureState.tradeData.state)
            {
                case TradeState.TRADING_STATE_RUNNING:
                    SendMessageHook(new TradingCloseComposer());
                    return;
                case TradeState.TRADING_STATE_CONFIRMING:
                    SendMessageHook(new TradingCancelComposer());
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

                GetConnection().send(new TradingOpenComposer(tradeEvent.objectId));
            }
        }
    }, [ isVisible, close ]);

    useUiEvent(InventoryEvent.SHOW_INVENTORY, onInventoryEvent);
    useUiEvent(InventoryEvent.HIDE_INVENTORY, onInventoryEvent);
    useUiEvent(InventoryEvent.TOGGLE_INVENTORY, onInventoryEvent);
    useUiEvent(InventoryTradeRequestEvent.REQUEST_TRADE, onInventoryEvent);

    const onRoomEngineObjectPlacedEvent = useCallback((event: RoomEngineObjectPlacedEvent) =>
    {
        if(!isObjectMoverRequested()) return;

        setObjectMoverRequested(false);

        if(!event.placedInRoom) setIsVisible(true);
    }, []);

    useRoomEngineEvent(RoomEngineObjectEvent.PLACED, onRoomEngineObjectPlacedEvent);

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

    useRoomSessionManagerEvent(RoomSessionEvent.CREATED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionEvent.ENDED, onRoomSessionEvent);

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

    return (
        <InventoryContextProvider value={ { furnitureState, dispatchFurnitureState, botState, dispatchBotState, petState, dispatchPetState, badgeState, dispatchBadgeState } }>
            <InventoryMessageHandler />
            { isVisible &&
                <NitroCardView className="nitro-inventory">
                    <NitroCardHeaderView headerText={ LocalizeText('inventory.title') } onCloseClick={ close } />
                    { !furnitureState.tradeData &&
                        <>
                            <NitroCardTabsView>
                                { tabs.map((name, index) =>
                                    {
                                        return (
                                            <NitroCardTabsItemView key={ index } isActive={ (currentTab === name) } onClick={ event => setCurrentTab(name) }>
                                                { LocalizeText(name) }
                                            </NitroCardTabsItemView>
                                        );
                                    }) }
                            </NitroCardTabsView>
                            <NitroCardContentView>
                                { (currentTab === InventoryTabs.FURNITURE ) &&
                                    <InventoryFurnitureView roomSession={ roomSession } roomPreviewer={ roomPreviewer } /> }
                                { (currentTab === InventoryTabs.BOTS ) &&
                                    <InventoryBotView roomSession={ roomSession } roomPreviewer={ roomPreviewer } /> }
                                { (currentTab === InventoryTabs.PETS ) && 
                                    <InventoryPetView roomSession={ roomSession } roomPreviewer={ roomPreviewer } /> }
                                { (currentTab === InventoryTabs.BADGES ) && 
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
