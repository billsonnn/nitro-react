import { IObjectData, TradingListAddItemComposer, TradingListAddItemsComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaLock, FaUnlock } from 'react-icons/fa';
import { FurniCategory, GroupItem, IFurnitureItem, LocalizeText, NotificationAlertType, SendMessageComposer, TradeState, getGuildFurniType } from '../../../../api';
import { AutoGrid, Button, Column, Flex, Grid, LayoutGridItem, Text } from '../../../../common';
import { useInventoryTrade, useNotification } from '../../../../hooks';
import { InventoryFurnitureSearchView } from './InventoryFurnitureSearchView';

interface InventoryTradeViewProps
{
    cancelTrade: () => void;
}

const MAX_ITEMS_TO_TRADE: number = 9;

export const InventoryTradeView: FC<InventoryTradeViewProps> = props =>
{
    const { cancelTrade = null } = props;
    const [ groupItem, setGroupItem ] = useState<GroupItem>(null);
    const [ ownGroupItem, setOwnGroupItem ] = useState<GroupItem>(null);
    const [ otherGroupItem, setOtherGroupItem ] = useState<GroupItem>(null);
    const [ filteredGroupItems, setFilteredGroupItems ] = useState<GroupItem[]>(null);
    const [ countdownTick, setCountdownTick ] = useState(3);
    const [ quantity, setQuantity ] = useState<number>(1);
    const { ownUser = null, otherUser = null, groupItems = [], tradeState = TradeState.TRADING_STATE_READY, progressTrade = null, removeItem = null, setTradeState = null } = useInventoryTrade();
    const { simpleAlert = null } = useNotification();

    const canTradeItem = (isWallItem: boolean, spriteId: number, category: number, groupable: boolean, stuffData: IObjectData) =>
    {
        if(!ownUser || ownUser.accepts || !ownUser.userItems) return false;

        if(ownUser.userItems.length < MAX_ITEMS_TO_TRADE) return true;

        if(!groupable) return false;

        let type = spriteId.toString();

        if(category === FurniCategory.POSTER)
        {
            type = ((type + 'poster') + stuffData.getLegacyString());
        }
        else
        {
            if(category === FurniCategory.GUILD_FURNI)
            {
                type = getGuildFurniType(spriteId, stuffData);
            }
            else
            {
                type = (((isWallItem) ? 'I' : 'S') + type);
            }
        }

        return !!ownUser.userItems.getValue(type);
    };

    const attemptItemOffer = (count: number) =>
    {
        if(!groupItem) return;

        const tradeItems = groupItem.getTradeItems(count);

        if(!tradeItems || !tradeItems.length) return;

        let coreItem: IFurnitureItem = null;
        const itemIds: number[] = [];

        for(const item of tradeItems)
        {
            itemIds.push(item.id);

            if(!coreItem) coreItem = item;
        }

        const ownItemCount = ownUser.userItems.length;

        if((ownItemCount + itemIds.length) <= 1500)
        {
            if(!coreItem.isGroupable && (itemIds.length))
            {
                SendMessageComposer(new TradingListAddItemComposer(itemIds.pop()));
            }
            else
            {
                const tradeIds: number[] = [];

                for(const itemId of itemIds)
                {
                    if(canTradeItem(coreItem.isWallItem, coreItem.type, coreItem.category, coreItem.isGroupable, coreItem.stuffData))
                    {
                        tradeIds.push(itemId);
                    }
                }

                if(tradeIds.length)
                {
                    if(tradeIds.length === 1)
                    {
                        SendMessageComposer(new TradingListAddItemComposer(tradeIds.pop()));
                    }
                    else
                    {
                        SendMessageComposer(new TradingListAddItemsComposer(...tradeIds));
                    }
                }
            }
        }
        else
        {
            simpleAlert(LocalizeText('trading.items.too_many_items.desc'), NotificationAlertType.DEFAULT, null, null, LocalizeText('trading.items.too_many_items.title'));
        }
    };

    const getLockIcon = (accepts: boolean) =>
    {
        if(accepts)
        {
            return <FaLock className="text-success fa-icon" />;
        }
        else
        {
            return <FaUnlock className="text-danger fa-icon" />;
        }
    };

    const updateQuantity = (value: number, totalItemCount: number) =>
    {
        if(isNaN(Number(value)) || Number(value) < 0 || !value) value = 1;

        value = Math.max(Number(value), 1);
        value = Math.min(Number(value), totalItemCount);

        if(value === quantity) return;

        setQuantity(value);
    };

    const changeCount = (totalItemCount: number) =>
    {
        updateQuantity(quantity, totalItemCount);
        attemptItemOffer(quantity);
    };

    useEffect(() =>
    {
        setQuantity(1);
    }, [ groupItem ]);

    useEffect(() =>
    {
        if(tradeState !== TradeState.TRADING_STATE_COUNTDOWN) return;

        setCountdownTick(3);

        const interval = setInterval(() =>
        {
            setCountdownTick(prevValue =>
            {
                const newValue = (prevValue - 1);

                if(newValue === 0) clearInterval(interval);

                return newValue;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [ tradeState, setTradeState ]);

    useEffect(() =>
    {
        if(countdownTick !== 0) return;

        setTradeState(TradeState.TRADING_STATE_CONFIRMING);
    }, [ countdownTick, setTradeState ]);

    if((tradeState === TradeState.TRADING_STATE_READY) || !ownUser || !otherUser) return null;

    return (
        <Grid>
            <Column overflow="hidden" size={ 4 }>
                <InventoryFurnitureSearchView groupItems={ groupItems } setGroupItems={ setFilteredGroupItems } />
                <Flex column fullHeight gap={ 2 } justifyContent="between" overflow="hidden">
                    <AutoGrid columnCount={ 3 }>
                        { filteredGroupItems && (filteredGroupItems.length > 0) && filteredGroupItems.map((item, index) =>
                        {
                            const count = item.getUnlockedCount();

                            return (
                                <LayoutGridItem key={ index } className={ !count ? 'opacity-0-5 ' : '' } itemActive={ (groupItem === item) } itemCount={ count } itemImage={ item.iconUrl } itemUniqueNumber={ item.stuffData.uniqueNumber } onClick={ event => (count && setGroupItem(item)) } onDoubleClick={ event => attemptItemOffer(1) }>
                                    { ((count > 0) && (groupItem === item)) &&
                                        <Button className="trade-button bottom-1 end-1" position="absolute" variant="success" onClick={ event => attemptItemOffer(1) }>
                                            <FaChevronRight className="fa-icon" />
                                        </Button>
                                    }
                                </LayoutGridItem>
                            );
                        }) }
                    </AutoGrid>
                    <Column alignItems="end" gap={ 1 }>
                        <Grid overflow="hidden">
                            <Column overflow="hidden" size={ 6 }>
                                <input className="min-h-[calc(1.5em+ .5rem+2px)] px-[.5rem] py-[.25rem]  rounded-[.2rem] form-control-sm quantity-input" disabled={ !groupItem } placeholder={ LocalizeText('catalog.bundlewidget.spinner.select.amount') } type="number" value={ quantity } onChange={ event => setQuantity(event.target.valueAsNumber) } />
                            </Column>
                            <Column overflow="hidden" size={ 6 }>
                                <Button disabled={ !groupItem } variant="secondary" onClick={ event => changeCount(groupItem.getUnlockedCount()) }>{ LocalizeText('inventory.trading.areoffering') }</Button>
                            </Column>
                        </Grid>
                        <div className="badge bg-muted w-full">
                            { groupItem ? groupItem.name : LocalizeText('catalog_selectproduct') }
                        </div>
                    </Column>
                </Flex>
            </Column>
            <Column overflow="hidden" size={ 8 }>
                <Grid overflow="hidden">
                    <Column overflow="hidden" size={ 6 }>
                        <div className="flex justify-between items-center">
                            <Text>{ LocalizeText('inventory.trading.you') } { LocalizeText('inventory.trading.areoffering') }:</Text>
                            { getLockIcon(ownUser.accepts) }
                        </div>
                        <AutoGrid columnCount={ 3 }>
                            { Array.from(Array(MAX_ITEMS_TO_TRADE), (e, i) =>
                            {
                                const item = (ownUser.userItems.getWithIndex(i) || null);

                                if(!item) return <LayoutGridItem key={ i } />;

                                return (
                                    <LayoutGridItem key={ i } itemActive={ (ownGroupItem === item) } itemCount={ item.getTotalCount() } itemImage={ item.iconUrl } itemUniqueNumber={ item.stuffData.uniqueNumber } onClick={ event => setOwnGroupItem(item) } onDoubleClick={ event => removeItem(item) }>
                                        { (ownGroupItem === item) &&
                                            <Button className="trade-button bottom-1 start-1" position="absolute" variant="danger" onClick={ event => removeItem(item) }>
                                                <FaChevronLeft className="fa-icon" />
                                            </Button> }
                                    </LayoutGridItem>
                                );
                            }) }
                        </AutoGrid>
                        <div className="badge bg-muted w-full">
                            { ownGroupItem ? ownGroupItem.name : LocalizeText('catalog_selectproduct') }
                        </div>
                    </Column>
                    <Column overflow="hidden" size={ 6 }>
                        <div className="flex justify-between items-center">
                            <Text>{ otherUser.userName } { LocalizeText('inventory.trading.isoffering') }:</Text>
                            { getLockIcon(otherUser.accepts) }
                        </div>
                        <AutoGrid columnCount={ 3 }>
                            { Array.from(Array(MAX_ITEMS_TO_TRADE), (e, i) =>
                            {
                                const item = (otherUser.userItems.getWithIndex(i) || null);

                                if(!item) return <LayoutGridItem key={ i } />;

                                return <LayoutGridItem key={ i } itemActive={ (otherGroupItem === item) } itemCount={ item.getTotalCount() } itemImage={ item.iconUrl } itemUniqueNumber={ item.stuffData.uniqueNumber } onClick={ event => setOtherGroupItem(item) } />;
                            }) }
                        </AutoGrid>
                        <div className="badge bg-muted w-full">
                            { otherGroupItem ? otherGroupItem.name : LocalizeText('catalog_selectproduct') }
                        </div>
                    </Column>
                </Grid>
                <div className="flex !flex-grow justify-between">
                    <Button variant="danger" onClick={ cancelTrade }>{ LocalizeText('generic.cancel') }</Button>
                    { (tradeState === TradeState.TRADING_STATE_READY) &&
                        <Button disabled={ (!ownUser.itemCount && !otherUser.itemCount) } variant="secondary" onClick={ progressTrade }>{ LocalizeText('inventory.trading.accept') }</Button> }
                    { (tradeState === TradeState.TRADING_STATE_RUNNING) &&
                        <Button disabled={ (!ownUser.itemCount && !otherUser.itemCount) } variant="secondary" onClick={ progressTrade }>{ LocalizeText(ownUser.accepts ? 'inventory.trading.modify' : 'inventory.trading.accept') }</Button> }
                    { (tradeState === TradeState.TRADING_STATE_COUNTDOWN) &&
                        <Button disabled variant="secondary">{ LocalizeText('inventory.trading.countdown', [ 'counter' ], [ countdownTick.toString() ]) }</Button> }
                    { (tradeState === TradeState.TRADING_STATE_CONFIRMING) &&
                        <Button variant="secondary" onClick={ progressTrade }>{ LocalizeText('inventory.trading.button.restore') }</Button> }
                    { (tradeState === TradeState.TRADING_STATE_CONFIRMED) &&
                        <Button variant="secondary">{ LocalizeText('inventory.trading.info.waiting') }</Button> }
                </div>
            </Column>
        </Grid>
    );
};
