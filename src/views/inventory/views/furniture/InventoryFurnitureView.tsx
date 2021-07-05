import { FurnitureListComposer, IObjectData, RoomObjectVariable, TradingListAddItemComposer, TradingListAddItemsComposer, Vector3d } from 'nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { GetConnection, GetRoomEngine } from '../../../../api';
import { SendMessageHook } from '../../../../hooks/messages/message-event';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { LimitedEditionCompactPlateView } from '../../../shared/limited-edition/compact-plate/LimitedEditionCompactPlateView';
import { RoomPreviewerView } from '../../../shared/room-previewer/RoomPreviewerView';
import { FurniCategory } from '../../common/FurniCategory';
import { attemptItemPlacement } from '../../common/FurnitureUtilities';
import { GroupItem } from '../../common/GroupItem';
import { IFurnitureItem } from '../../common/IFurnitureItem';
import { TradeState } from '../../common/TradeState';
import { _Str_16998 } from '../../common/TradingUtilities';
import { useInventoryContext } from '../../context/InventoryContext';
import { InventoryFurnitureActions } from '../../reducers/InventoryFurnitureReducer';
import { InventoryFurnitureViewProps } from './InventoryFurnitureView.types';
import { InventoryFurnitureResultsView } from './results/InventoryFurnitureResultsView';
import { InventoryFurnitureSearchView } from './search/InventoryFurnitureSearchView';

const MAX_ITEMS_TO_TRADE: number = 3;

export const InventoryFurnitureView: FC<InventoryFurnitureViewProps> = props =>
{
    const { roomSession = null, roomPreviewer = null } = props;
    const { furnitureState = null, dispatchFurnitureState = null } = useInventoryContext();
    const { needsFurniUpdate = false, groupItem = null, groupItems = [], tradeData = null } = furnitureState;
    const [ filteredGroupItems, setFilteredGroupItems ] = useState<GroupItem[]>(groupItems);

    const isTrading = useMemo(() =>
    {
        if(!tradeData) return false;
        
        return (tradeData.state >= TradeState.TRADING_STATE_RUNNING);
    }, [ tradeData ]);

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
        if(!tradeData || !groupItem || !isTrading) return;

        const tradeItems = groupItem.getTradeItems(count);

        if(!tradeItems || !tradeItems.length) return;

        let coreItem: IFurnitureItem = null;
        const itemIds: number[] = [];

        for(const item of tradeItems)
        {
            itemIds.push(item.id);

            if(!coreItem) coreItem = item;
        }

        const tradedIds: number[] = [];

        if(isTrading)
        {
            const ownItemCount = tradeData.ownUser.items.length;

            if((ownItemCount + itemIds.length) <= 1500)
            {
                if(!coreItem.isGroupable && (itemIds.length))
                {
                    GetConnection().send(new TradingListAddItemComposer(itemIds.pop()));
                }
                else
                {
                    const tradeIds: number[] = [];

                    for(const itemId of itemIds)
                    {
                        if(canTradeItem(coreItem.isWallItem, coreItem.type, coreItem.category, coreItem.isGroupable, coreItem.stuffData))
                        {
                            tradedIds.push(itemId);
                        }
                    }

                    if(tradedIds.length)
                    {
                        if(tradedIds.length === 1)
                        {
                            GetConnection().send(new TradingListAddItemComposer(tradedIds.pop()));
                        }
                        else
                        {
                            GetConnection().send(new TradingListAddItemsComposer(...tradedIds));
                        }
                    }
                }
            }
            else
            {
                //this._notificationService.alert('${trading.items.too_many_items.desc}', '${trading.items.too_many_items.title}');
            }
        }
    }, [ canTradeItem, groupItem, isTrading, tradeData ]);

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

            dispatchFurnitureState({
                type: InventoryFurnitureActions.SET_GROUP_ITEM,
                payload: {
                    groupItem: null
                }
            });
        }

    }, [ needsFurniUpdate, groupItems, dispatchFurnitureState ]);

    useEffect(() =>
    {
        if(!groupItem || !roomPreviewer) return;

        const furnitureItem = groupItem.getLastItem();

        if(!furnitureItem) return;

        const roomEngine = GetRoomEngine();

        let wallType        = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_WALL_TYPE);
        let floorType       = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_FLOOR_TYPE);
        let landscapeType   = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_LANDSCAPE_TYPE);

        wallType        = (wallType && wallType.length) ? wallType : '101';
        floorType       = (floorType && floorType.length) ? floorType : '101';
        landscapeType   = (landscapeType && landscapeType.length) ? landscapeType : '1.1';

        roomPreviewer.reset(false);
        roomPreviewer.updateObjectRoom(floorType, wallType, landscapeType);
        roomPreviewer.updateRoomWallsAndFloorVisibility(true, true);

        if((furnitureItem.category === FurniCategory._Str_3639) || (furnitureItem.category === FurniCategory._Str_3683) || (furnitureItem.category === FurniCategory._Str_3432))
        {
            floorType       = ((furnitureItem.category === FurniCategory._Str_3683) ? groupItem.stuffData.getLegacyString() : floorType);
            wallType        = ((furnitureItem.category === FurniCategory._Str_3639) ? groupItem.stuffData.getLegacyString() : wallType);
            landscapeType   = ((furnitureItem.category === FurniCategory._Str_3432) ? groupItem.stuffData.getLegacyString() : landscapeType);

            roomPreviewer.updateObjectRoom(floorType, wallType, landscapeType);

            if(furnitureItem.category === FurniCategory._Str_3432)
            {
                // insert a window if the type is landscape
                //_local_19 = this._model.controller._Str_18225("ads_twi_windw", ProductTypeEnum.WALL);
                //this._roomPreviewer._Str_12087(_local_19.id, new Vector3d(90, 0, 0), _local_19._Str_4558);
            }
        }
        else
        {
            if(groupItem.isWallItem)
            {
                roomPreviewer.addWallItemIntoRoom(groupItem.type, new Vector3d(90), furnitureItem.stuffData.getLegacyString());
            }
            else
            {
                roomPreviewer.addFurnitureIntoRoom(groupItem.type, new Vector3d(90), groupItem.stuffData, (furnitureItem.extra.toString()));
            }
        }
    }, [ roomPreviewer, groupItem ]);

    if(!groupItems || !groupItems.length)
    {
        return (
            <div className="row h-100">
                <div className="col-5 d-flex justify-content-center align-items-center">
                    <div className="empty-image"></div>
                </div>
                <div className="d-flex flex-column col-7 justify-content-center">
                    <div className="h5 m-0 text-black fw-bold m-0 mb-2">
                        { LocalizeText('inventory.empty.title') }
                    </div>
                    <div className="h6 text-black">{ LocalizeText('inventory.empty.desc') }</div>
                </div>
            </div>
        );
    }

    return (
        <div className="row h-100">
            <div className="col-7 d-flex flex-column h-100">
                <InventoryFurnitureSearchView groupItems={ groupItems } setGroupItems={ setFilteredGroupItems } />
                <InventoryFurnitureResultsView groupItems={ filteredGroupItems }  />
            </div>
            <div className="position-relative d-flex flex-column col-5 justify-space-between">
                <RoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                { groupItem &&groupItem.stuffData.isUnique &&
                    <div className="position-absolute limited-edition-info-container">
                        <LimitedEditionCompactPlateView uniqueNumber={ groupItem.stuffData.uniqueNumber } uniqueSeries={ groupItem.stuffData.uniqueSeries } />
                    </div> }
                { groupItem &&
                    <div className="d-flex flex-column flex-grow-1">
                        <p className="flex-grow-1 fs-6 text-black my-2">{ groupItem.name }</p>
                        { !!roomSession && !isTrading &&
                            <button type="button" className="btn btn-success btn-sm" onClick={ event => attemptItemPlacement(groupItem) }>{ LocalizeText('inventory.furni.placetoroom') }</button> }
                        { isTrading &&
                            <button type="button" className="btn btn-primary btn-sm" onClick={ event => attemptItemOffer(1) }>{ LocalizeText('inventory.trading.offer') }</button> }
                    </div> }
            </div>
        </div>
    );
}
