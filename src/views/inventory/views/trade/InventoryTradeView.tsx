import { FurnitureListComposer, IObjectData, TradingAcceptComposer, TradingConfirmationComposer, TradingListAddItemComposer, TradingListAddItemsComposer, TradingListItemRemoveComposer, TradingUnacceptComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { SendMessageHook } from '../../../../hooks/messages';
import { NitroLayoutButton, NitroLayoutFlex, NitroLayoutFlexColumn } from '../../../../layout';
import { NitroLayoutBase } from '../../../../layout/base';
import { NitroCardGridItemView } from '../../../../layout/card/grid/item/NitroCardGridItemView';
import { NitroCardGridView } from '../../../../layout/card/grid/NitroCardGridView';
import { NitroLayoutGridColumn } from '../../../../layout/grid/column/NitroLayoutGridColumn';
import { NitroLayoutGrid } from '../../../../layout/grid/NitroLayoutGrid';
import { FurniCategory } from '../../common/FurniCategory';
import { GroupItem } from '../../common/GroupItem';
import { IFurnitureItem } from '../../common/IFurnitureItem';
import { TradeState } from '../../common/TradeState';
import { _Str_16998 } from '../../common/TradingUtilities';
import { useInventoryContext } from '../../context/InventoryContext';
import { InventoryFurnitureActions } from '../../reducers/InventoryFurnitureReducer';
import { InventoryFurnitureSearchView } from '../furniture/search/InventoryFurnitureSearchView';
import { InventoryTradeViewProps } from './InventoryTradeView.types';

const MAX_ITEMS_TO_TRADE: number = 9;

export const InventoryTradeView: FC<InventoryTradeViewProps> = props =>
{
    const { cancelTrade = null } = props;
    const [ groupItem, setGroupItem ] = useState<GroupItem>(null);
    const [ ownGroupItem, setOwnGroupItem ] = useState<GroupItem>(null);
    const [ otherGroupItem, setOtherGroupItem ] = useState<GroupItem>(null);
    const [ filteredGroupItems, setFilteredGroupItems ] = useState<GroupItem[]>(null);
    const [ countdownTick, setCountdownTick ] = useState(3);
    const { furnitureState = null, dispatchFurnitureState = null } = useInventoryContext();
    const { needsFurniUpdate = false, groupItems = [], tradeData = null } = furnitureState;

    const canTradeItem = useCallback((isWallItem: boolean, spriteId: number, category: number, groupable: boolean, stuffData: IObjectData) =>
    {
        if(!tradeData || !tradeData.ownUser || tradeData.ownUser.accepts || !tradeData.ownUser.items) return false;

        if(tradeData.ownUser.items.length < MAX_ITEMS_TO_TRADE) return true;

        if(!groupable) return false;

        let type = spriteId.toString();

        if(category === FurniCategory._Str_5186)
        {
            type = ((type + 'poster') + stuffData.getLegacyString());
        }
        else
        {
            if(category === FurniCategory._Str_12454)
            {
                type = _Str_16998(spriteId, stuffData);
            }
            else
            {
                type = (((isWallItem) ? 'I' : 'S') + type);
            }
        }

        return !!tradeData.ownUser.items.getValue(type);
    }, [ tradeData ]);

    const attemptItemOffer = useCallback((count: number) =>
    {
        if(!tradeData || !groupItem) return;

        const tradeItems = groupItem.getTradeItems(count);

        if(!tradeItems || !tradeItems.length) return;

        let coreItem: IFurnitureItem = null;
        const itemIds: number[] = [];

        for(const item of tradeItems)
        {
            itemIds.push(item.id);

            if(!coreItem) coreItem = item;
        }

        const ownItemCount = tradeData.ownUser.items.length;

        if((ownItemCount + itemIds.length) <= 1500)
        {
            if(!coreItem.isGroupable && (itemIds.length))
            {
                SendMessageHook(new TradingListAddItemComposer(itemIds.pop()));
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
                        SendMessageHook(new TradingListAddItemComposer(tradeIds.pop()));
                    }
                    else
                    {
                        SendMessageHook(new TradingListAddItemsComposer(...tradeIds));
                    }
                }
            }
        }
        else
        {
            //this._notificationService.alert('${trading.items.too_many_items.desc}', '${trading.items.too_many_items.title}');
        }
    }, [ groupItem, tradeData, canTradeItem ]);

    const removeItem = useCallback((group: GroupItem) =>
    {
        const item = group.getLastItem();

        if(!item) return;

        SendMessageHook(new TradingListItemRemoveComposer(item.id));
    }, []);

    useEffect(() =>
    {
        if(needsFurniUpdate)
        {
            dispatchFurnitureState({
                type: InventoryFurnitureActions.SET_NEEDS_UPDATE,
                payload: {
                    flag: false
                }
            });

            SendMessageHook(new FurnitureListComposer());
        }

    }, [ needsFurniUpdate, groupItems, dispatchFurnitureState ]);

    const progressTrade = useCallback(() =>
    {
        switch(tradeData.state)
        {
            case TradeState.TRADING_STATE_RUNNING:
                if(!tradeData.otherUser.itemCount && !tradeData.ownUser.accepts)
                {
                    //this._notificationService.alert('${inventory.trading.warning.other_not_offering}');
                }

                if(tradeData.ownUser.accepts)
                {
                    SendMessageHook(new TradingUnacceptComposer());
                }
                else
                {
                    SendMessageHook(new TradingAcceptComposer());
                }
                return;
            case TradeState.TRADING_STATE_CONFIRMING:
                SendMessageHook(new TradingConfirmationComposer());

                dispatchFurnitureState({
                    type: InventoryFurnitureActions.SET_TRADE_STATE,
                    payload: {
                        tradeState: TradeState.TRADING_STATE_CONFIRMED
                    }
                });
                return;
        }
    }, [ tradeData, dispatchFurnitureState ]);

    const getTradeButton = useMemo(() =>
    {
        if(!tradeData) return null;

        switch(tradeData.state)
        {
            case TradeState.TRADING_STATE_READY:
                return <button type="button" className="btn btn-secondary" disabled={ (!tradeData.ownUser.itemCount && !tradeData.otherUser.itemCount) } onClick={ progressTrade }>{ LocalizeText('inventory.trading.accept') }</button>;
            case TradeState.TRADING_STATE_RUNNING:
                return <button type="button" className="btn btn-secondary" disabled={ (!tradeData.ownUser.itemCount && !tradeData.otherUser.itemCount) } onClick={ progressTrade }>{ LocalizeText(tradeData.ownUser.accepts ? 'inventory.trading.modify' : 'inventory.trading.accept') }</button>;
            case TradeState.TRADING_STATE_COUNTDOWN:
                return <button type="button" className="btn btn-secondary" disabled>{ LocalizeText('inventory.trading.countdown', [ 'counter' ], [ countdownTick.toString() ]) }</button>;
            case TradeState.TRADING_STATE_CONFIRMING:
                return <button type="button" className="btn btn-secondary" onClick={ progressTrade }>{ LocalizeText('inventory.trading.button.restore') }</button>;
            case TradeState.TRADING_STATE_CONFIRMED:
                return <button type="button" className="btn btn-secondary">{ LocalizeText('inventory.trading.info.waiting') }</button>;
        }
    }, [ tradeData, countdownTick, progressTrade ]);

    useEffect(() =>
    {
        if(!tradeData || (tradeData.state !== TradeState.TRADING_STATE_COUNTDOWN)) return;

        setCountdownTick(3);

        const interval = setInterval(() =>
        {
            setCountdownTick(prevValue =>
                {
                    const newValue = (prevValue - 1);

                    if(newValue === -1)
                    {
                        dispatchFurnitureState({
                            type: InventoryFurnitureActions.SET_TRADE_STATE,
                            payload: {
                                tradeState: TradeState.TRADING_STATE_CONFIRMING
                            }
                        });

                        clearInterval(interval);
                    }

                    return newValue;
                });
        }, 1000);

        return () =>
        {
            clearInterval(interval);
        }
    }, [ tradeData, dispatchFurnitureState ]);

    return (
        <NitroLayoutGrid>
            <NitroLayoutGridColumn size={ 4 }>
                <NitroLayoutFlexColumn className="h-100" overflow="auto" gap={ 2 }>
                    <InventoryFurnitureSearchView groupItems={ groupItems } setGroupItems={ setFilteredGroupItems } />
                    <NitroCardGridView>
                        { filteredGroupItems && (filteredGroupItems.length > 0) && filteredGroupItems.map((item, index) =>
                            {
                                const count = item.getUnlockedCount();

                                return (
                                    <NitroCardGridItemView key={ index } className={ !count ? 'opacity-0-5 ' : '' } itemImage={ item.iconUrl } itemCount={ count } itemActive={ (groupItem === item) } itemUniqueNumber={ item.stuffData.uniqueNumber } onClick={ event => (count && setGroupItem(item)) }>
                                        { ((count > 0) && (groupItem === item)) &&
                                            <button className="btn btn-success btn-sm trade-button" onClick={ event => attemptItemOffer(1) }>
                                                <i className="fas fa-chevron-right" />
                                            </button> }
                                    </NitroCardGridItemView>
                                );
                            }) }
                    </NitroCardGridView>
                </NitroLayoutFlexColumn>
                <NitroLayoutBase className="badge bg-muted w-100">
                    { groupItem ? groupItem.name : LocalizeText('catalog_selectproduct') }
                </NitroLayoutBase>
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn size={ 8 }>
                <NitroLayoutGrid overflow="hidden">
                    <NitroLayoutGridColumn size={ 6 }>
                        <NitroLayoutFlexColumn className="h-100" overflow="auto" gap={ 2 }>
                            <span className="d-flex justify-content-between align-items-center text-black small mb-1">{ LocalizeText('inventory.trading.you') } { LocalizeText('inventory.trading.areoffering') }: <i className={ 'small fas ' + (tradeData.ownUser.accepts ? 'fa-lock text-success' : 'fa-unlock text-danger') } /></span>
                            <NitroCardGridView>
                                { Array.from(Array(MAX_ITEMS_TO_TRADE), (e, i) =>
                                    {
                                        const item = (tradeData.ownUser.items.getWithIndex(i) || null);

                                        if(!item) return <NitroCardGridItemView key={ i } />;

                                        return (
                                            <NitroCardGridItemView key={ i } itemActive={ (ownGroupItem === item) } itemImage={ item.iconUrl } itemCount={ item.getTotalCount() } itemUniqueNumber={ item.stuffData.uniqueNumber } onClick={ event => setOwnGroupItem(item) }>
                                                { (ownGroupItem === item) &&
                                                    <button className="btn btn-danger btn-sm trade-button left" onClick={ event => removeItem(item) }>
                                                        <i className="fas fa-chevron-left" />
                                                    </button> }
                                            </NitroCardGridItemView>
                                        );
                                    }) }
                            </NitroCardGridView>
                        </NitroLayoutFlexColumn>
                        <NitroLayoutBase className="badge bg-muted w-100">
                            { ownGroupItem ? ownGroupItem.name : LocalizeText('catalog_selectproduct') }
                        </NitroLayoutBase>
                    </NitroLayoutGridColumn>
                    <NitroLayoutGridColumn size={ 6 }>
                        <NitroLayoutFlexColumn className="h-100" overflow="auto" gap={ 2 }>
                            <span className="d-flex justify-content-between align-items-center  text-black small mb-1">{ tradeData.otherUser.userName } { LocalizeText('inventory.trading.isoffering') }: <i className={ 'small fas ' + (tradeData.otherUser.accepts ? 'fa-lock text-success' : 'fa-unlock text-danger') } /></span>
                            <NitroCardGridView>
                                { Array.from(Array(MAX_ITEMS_TO_TRADE), (e, i) =>
                                    {
                                        const item = (tradeData.otherUser.items.getWithIndex(i) || null);

                                        if(!item) return <NitroCardGridItemView key={ i } />;

                                        return <NitroCardGridItemView key={ i } itemActive={ (otherGroupItem === item) } itemImage={ item.iconUrl } itemCount={ item.getTotalCount() } itemUniqueNumber={ item.stuffData.uniqueNumber } onClick={ event => setOtherGroupItem(item) } />;
                                    }) }
                            </NitroCardGridView>
                        </NitroLayoutFlexColumn>
                        <NitroLayoutBase className="badge bg-muted w-100">
                            { otherGroupItem ? otherGroupItem.name : LocalizeText('catalog_selectproduct') }
                        </NitroLayoutBase>
                    </NitroLayoutGridColumn>
                </NitroLayoutGrid>
                <NitroLayoutFlex className="flex-grow-1 justify-content-between">
                    <NitroLayoutButton variant="danger" onClick={ cancelTrade }>{ LocalizeText('generic.cancel') }</NitroLayoutButton>
                    { getTradeButton }
                </NitroLayoutFlex>
            </NitroLayoutGridColumn>
        </NitroLayoutGrid>
    );
}
