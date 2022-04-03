import { AdvancedMap, TradingAcceptComposer, TradingAcceptEvent, TradingCancelComposer, TradingCloseComposer, TradingCloseEvent, TradingCloseParser, TradingCompletedEvent, TradingConfirmationComposer, TradingConfirmationEvent, TradingListItemEvent, TradingListItemRemoveComposer, TradingNotOpenEvent, TradingOpenEvent, TradingOpenFailedEvent, TradingOtherNotAllowedEvent, TradingUnacceptComposer, TradingYouAreNotAllowedEvent } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { useInventoryFurni } from '.';
import { UseMessageEventHook } from '..';
import { CloneObject, GetRoomSession, GetSessionDataManager, GroupItem, LocalizeText, NotificationUtilities, parseTradeItems, SendMessageComposer, TradeState, TradeUserData, TradingNotificationMessage, TradingNotificationType } from '../../api';

const useInventoryTradeState = () =>
{
    const [ ownUser, setOwnUser ] = useState<TradeUserData>(null);
    const [ otherUser, setOtherUser ] = useState<TradeUserData>(null);
    const [ tradeState, setTradeState ] = useState(TradeState.TRADING_STATE_READY);
    const { groupItems = [], setGroupItems = null, activate = null, deactivate = null } = useInventoryFurni();
    const isTrading = (tradeState >= TradeState.TRADING_STATE_RUNNING);

    const progressTrade = () =>
    {
        switch(tradeState)
        {
            case TradeState.TRADING_STATE_RUNNING:
                if(!otherUser.itemCount && !ownUser.accepts)
                {
                    NotificationUtilities.simpleAlert(LocalizeText('inventory.trading.warning.other_not_offering'), null, null, null);
                }

                if(ownUser.accepts)
                {
                    SendMessageComposer(new TradingUnacceptComposer());
                }
                else
                {
                    SendMessageComposer(new TradingAcceptComposer());
                }
                return;
            case TradeState.TRADING_STATE_CONFIRMING:
                SendMessageComposer(new TradingConfirmationComposer());

                setTradeState(TradeState.TRADING_STATE_CONFIRMED);
                return;
        }
    }

    const removeItem = (group: GroupItem) =>
    {
        const item = group.getLastItem();

        if(!item) return;

        SendMessageComposer(new TradingListItemRemoveComposer(item.id));
    }

    const stopTrading = () =>
    {
        if(!isTrading) return;

        switch(tradeState)
        {
            case TradeState.TRADING_STATE_RUNNING:
                SendMessageComposer(new TradingCloseComposer());
                return;
            default:
                SendMessageComposer(new TradingCancelComposer());
                return;
        }
    }

    const onTradingAcceptEvent = useCallback((event: TradingAcceptEvent) =>
    {
        const parser = event.getParser();

        if(!ownUser || !otherUser) return;

        if(ownUser.userId === parser.userID)
        {
            setOwnUser(prevValue =>
            {
                const newValue = CloneObject(prevValue);

                newValue.accepts = parser.userAccepts;

                return newValue;
            });
        }

        else if(otherUser.userId === parser.userID)
        {
            setOtherUser(prevValue =>
            {
                const newValue = CloneObject(prevValue);

                newValue.accepts = parser.userAccepts;

                return newValue;
            });
        }
    }, [ ownUser, otherUser ]);

    UseMessageEventHook(TradingAcceptEvent, onTradingAcceptEvent);

    const onTradingCloseEvent = useCallback((event: TradingCloseEvent) =>
    {
        const parser = event.getParser();

        if(parser.reason === TradingCloseParser.ERROR_WHILE_COMMIT)
        {
            TradingNotificationMessage(TradingNotificationType.ERROR_WHILE_COMMIT);
        }
        else
        {
            if(ownUser && (parser.userID !== ownUser.userId))
            {
                TradingNotificationMessage(TradingNotificationType.THEY_CANCELLED);
            }
        }

        setOwnUser(null);
        setOtherUser(null);
        setTradeState(TradeState.TRADING_STATE_READY);
    }, [ ownUser ]);

    UseMessageEventHook(TradingCloseEvent, onTradingCloseEvent);

    const onTradingCompletedEvent = useCallback((event: TradingCompletedEvent) =>
    {
        const parser = event.getParser();

        setOwnUser(null);
        setOtherUser(null);
        setTradeState(TradeState.TRADING_STATE_READY);
    }, []);

    UseMessageEventHook(TradingCompletedEvent, onTradingCompletedEvent);

    const onTradingConfirmationEvent = useCallback((event: TradingConfirmationEvent) =>
    {
        const parser = event.getParser();

        setTradeState(TradeState.TRADING_STATE_COUNTDOWN);
    }, []);

    UseMessageEventHook(TradingConfirmationEvent, onTradingConfirmationEvent);

    const onTradingListItemEvent = useCallback((event: TradingListItemEvent) =>
    {
        const parser = event.getParser();
        const firstUserItems = parseTradeItems(parser.firstUserItemArray);
        const secondUserItems = parseTradeItems(parser.secondUserItemArray);

        setOwnUser(prevValue =>
        {
            const newValue = CloneObject(prevValue);

            if(newValue.userId === parser.firstUserID)
            {
                newValue.creditsCount = parser.firstUserNumCredits;
                newValue.itemCount = parser.firstUserNumItems;
                newValue.userItems = firstUserItems;
            }
            else
            {
                newValue.creditsCount = parser.secondUserNumCredits;
                newValue.itemCount = parser.secondUserNumItems;
                newValue.userItems = secondUserItems;
            }

            const tradeIds: number[] = [];

            for(const groupItem of newValue.userItems.getValues())
            {
                let i = 0;

                while(i < groupItem.getTotalCount())
                {
                    const item = groupItem.getItemByIndex(i);

                    if(item) tradeIds.push(item.ref);

                    i++;
                }
            }

            setGroupItems(prevValue =>
            {
                const newValue = [ ...prevValue ];

                for(const groupItem of newValue) groupItem.lockItemIds(tradeIds);

                return newValue;
            });

            return newValue;
        });

        setOtherUser(prevValue =>
        {
            const newValue = CloneObject(prevValue);

            if(newValue.userId === parser.firstUserID)
            {
                newValue.creditsCount = parser.firstUserNumCredits;
                newValue.itemCount = parser.firstUserNumItems;
                newValue.userItems = firstUserItems;
            }
            else
            {
                newValue.creditsCount = parser.secondUserNumCredits;
                newValue.itemCount = parser.secondUserNumItems;
                newValue.userItems = secondUserItems;
            }

            return newValue;
        });
    }, [ setGroupItems ]);

    UseMessageEventHook(TradingListItemEvent, onTradingListItemEvent);

    const onTradingNotOpenEvent = useCallback((event: TradingNotOpenEvent) =>
    {
        const parser = event.getParser();
    }, []);

    UseMessageEventHook(TradingNotOpenEvent, onTradingNotOpenEvent);

    const onTradingOpenEvent = useCallback((event: TradingOpenEvent) =>
    {
        const parser = event.getParser();

        const firstUser = new TradeUserData();
        const firstUserData = GetRoomSession().userDataManager.getUserData(parser.userID);
        
        firstUser.userItems = new AdvancedMap();

        const secondUser = new TradeUserData();
        const secondUserData = GetRoomSession().userDataManager.getUserData(parser.otherUserID);

        secondUser.userItems = new AdvancedMap();

        if(firstUserData.webID === GetSessionDataManager().userId)
        {
            firstUser.userId = firstUserData.webID;
            firstUser.userName = firstUserData.name;
            firstUser.canTrade = parser.userCanTrade;

            secondUser.userId = secondUserData.webID;
            secondUser.userName = secondUserData.name;
            secondUser.canTrade = parser.otherUserCanTrade;
        }

        else if(secondUserData.webID === GetSessionDataManager().userId)
        {
            firstUser.userId = secondUserData.webID;
            firstUser.userName = secondUserData.name;
            firstUser.canTrade = parser.otherUserCanTrade;

            secondUser.userId = firstUserData.webID;
            secondUser.userName = firstUserData.name;
            secondUser.canTrade = parser.userCanTrade;
        }
        
        setOwnUser(firstUser);
        setOtherUser(secondUser);
        setTradeState(TradeState.TRADING_STATE_RUNNING);
    }, []);

    UseMessageEventHook(TradingOpenEvent, onTradingOpenEvent);

    const onTradingOpenFailedEvent = useCallback((event: TradingOpenFailedEvent) =>
    {
        const parser = event.getParser();

        TradingNotificationMessage(parser.reason, parser.otherUserName);
    }, []);

    UseMessageEventHook(TradingOpenFailedEvent, onTradingOpenFailedEvent);

    const onTradingOtherNotAllowedEvent = useCallback((event: TradingOtherNotAllowedEvent) =>
    {
        const parser = event.getParser();

        TradingNotificationMessage(TradingNotificationType.THEY_NOT_ALLOWED);
    }, []);

    UseMessageEventHook(TradingOtherNotAllowedEvent, onTradingOtherNotAllowedEvent);

    const onTradingYouAreNotAllowedEvent = useCallback((event: TradingYouAreNotAllowedEvent) =>
    {
        const parser = event.getParser();

        TradingNotificationMessage(TradingNotificationType.YOU_NOT_ALLOWED);
    }, []);

    UseMessageEventHook(TradingYouAreNotAllowedEvent, onTradingYouAreNotAllowedEvent);

    useEffect(() =>
    {
        if(tradeState === TradeState.TRADING_STATE_READY) return;

        const id = activate();

        return () => deactivate(id);
    }, [ tradeState, activate, deactivate ]);

    return { ownUser, otherUser, tradeState, setTradeState, isTrading, groupItems, progressTrade, removeItem, stopTrading };
}

export const useInventoryTrade = () => useBetween(useInventoryTradeState);
