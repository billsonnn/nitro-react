import { FurnitureListComposer, IObjectData, TradingListAddItemComposer, TradingListAddItemsComposer, TradingListItemRemoveComposer } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { SendMessageHook } from '../../../../hooks/messages';
import { NitroCardGridItemView } from '../../../../layout/card/grid/item/NitroCardGridItemView';
import { NitroCardGridView } from '../../../../layout/card/grid/NitroCardGridView';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { FurniCategory } from '../../common/FurniCategory';
import { GroupItem } from '../../common/GroupItem';
import { IFurnitureItem } from '../../common/IFurnitureItem';
import { _Str_16998 } from '../../common/TradingUtilities';
import { useInventoryContext } from '../../context/InventoryContext';
import { InventoryFurnitureActions } from '../../reducers/InventoryFurnitureReducer';
import { InventoryFurnitureSearchView } from '../furniture/search/InventoryFurnitureSearchView';
import { InventoryTradeViewProps } from './InventoryTradeView.types';

const MAX_ITEMS_TO_TRADE: number = 9;

export const InventoryTradeView: FC<InventoryTradeViewProps> = props =>
{
    const { furnitureState = null, dispatchFurnitureState = null } = useInventoryContext();
    const { needsFurniUpdate = false, groupItems = [], tradeData = null } = furnitureState;
    const [ groupItem, setGroupItem ] = useState<GroupItem>(null);
    const [ selectedGroupItem, setSelectedGroupItem ] = useState<GroupItem>(null);
    const [ filteredGroupItems, setFilteredGroupItems ] = useState<GroupItem[]>(null);

    const close = useCallback(() =>
    {

    }, []);

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
        else
        {
            setFilteredGroupItems(groupItems);
        }

    }, [ needsFurniUpdate, groupItems, dispatchFurnitureState ]);

    return (
        <div className="row h-100">
            <div className="d-flex flex-column col-4 h-100">
                <InventoryFurnitureSearchView groupItems={ groupItems } setGroupItems={ setFilteredGroupItems } />
                <NitroCardGridView columns={ 3 }>
                    { filteredGroupItems && (filteredGroupItems.length > 0) && filteredGroupItems.map((item, index) =>
                        {
                            const count = item.getUnlockedCount();

                            return (
                                <NitroCardGridItemView key={ index } className={ !count ? 'opacity-0-5 ' : '' } itemImage={ item.iconUrl } itemCount={ count } itemActive={ (groupItem === item) } itemUnique={ item.stuffData.isUnique } itemUniqueNumber={ item.stuffData.uniqueNumber } onClick={ event => (count && setGroupItem(item)) }>
                                    { ((count > 0) && (groupItem === item)) &&
                                        <button className="btn btn-success btn-sm trade-button" onClick={ event => attemptItemOffer(1) }>
                                            <i className="fas fa-chevron-right" />
                                        </button> }
                                </NitroCardGridItemView>
                            );
                        }) }
                </NitroCardGridView>
            </div>
            <div className="col-8 row mx-0">
                <div className="d-flex flex-column col-6">
                    <div className="badge bg-primary w-100 p-1 mb-1 me-1">{ LocalizeText('inventory.trading.you') }</div>
                    <NitroCardGridView columns={ 3 }>
                        { Array.from(Array(MAX_ITEMS_TO_TRADE), (e, i) =>
                            {
                                const item = (tradeData.ownUser.items.getWithIndex(i) || null);

                                if(!item) return <NitroCardGridItemView key={ i } />;

                                return (
                                    <NitroCardGridItemView key={ i } itemActive={ (item === selectedGroupItem) } itemImage={ item.iconUrl } itemCount={ item.getTotalCount() } itemUnique={ item.stuffData.isUnique } itemUniqueNumber={ item.stuffData.uniqueNumber } onClick={ event => setSelectedGroupItem(item) }>
                                        { (item === selectedGroupItem) &&
                                            <button className="btn btn-danger btn-sm trade-button left" onClick={ event => removeItem(item) }>
                                                <i className="fas fa-chevron-left" />
                                            </button> }
                                    </NitroCardGridItemView>
                                );
                            }) }
                    </NitroCardGridView>
                </div>
                <div className="d-flex flex-column col-6">
                    <div className="badge bg-primary w-100 p-1 mb-1 me-1">{ tradeData.otherUser.userName }</div>
                    <NitroCardGridView columns={ 3 }>
                        { Array.from(Array(MAX_ITEMS_TO_TRADE), (e, i) =>
                            {
                                const item = (tradeData.otherUser.items.getWithIndex(i) || null);

                                if(!item) return <NitroCardGridItemView key={ i } />;

                                return <NitroCardGridItemView key={ i } itemActive={ (item === selectedGroupItem) } itemImage={ item.iconUrl } itemCount={ item.getTotalCount() } itemUnique={ item.stuffData.isUnique } itemUniqueNumber={ item.stuffData.uniqueNumber } onClick={ event => setSelectedGroupItem(item) } />;
                            }) }
                    </NitroCardGridView>
                </div>
                <div className="d-flex col-12 bg-muted">
                    plz
                </div>
            </div>
        </div>
    );
}
