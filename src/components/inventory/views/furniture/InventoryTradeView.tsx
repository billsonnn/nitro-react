import { AdvancedMap, IObjectData, RoomObjectVariable, RoomPreviewer, TradingListAddItemComposer, TradingListAddItemsComposer, Vector3d } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { FurniCategory, GetRoomEngine, GetSessionDataManager, GroupItem, IFurnitureItem, LocalizeText, NotificationAlertType, SendMessageComposer, TradeState, getGuildFurniType } from "../../../../api"
import { Button, LayoutGridItem, LayoutLimitedEditionCompactPlateView, LayoutRarityLevelView, LayoutRoomPreviewerView } from "../../../../common"
import { useInventoryTrade, useNotification } from "../../../../hooks"
import { InventoryFurnitureSearchView } from "./InventoryFurnitureSearchView"

interface InventoryTradeViewProps
{
    cancelTrade: () => void;
}

interface InventoryFurnitureViewProps
{
    roomPreviewer: RoomPreviewer;
}

interface CombinedProps extends InventoryTradeViewProps, InventoryFurnitureViewProps {}

export const InventoryTradeView: FC<CombinedProps> = props =>
{
    const { cancelTrade = null } = props
    const { roomPreviewer = null } = props
    const [ groupItem, setGroupItem ] = useState<GroupItem>(null)
    const [ ownGroupItem, setOwnGroupItem ] = useState<GroupItem>(null)
    const [ otherGroupItem, setOtherGroupItem ] = useState<GroupItem>(null)
    const [ filteredGroupItems, setFilteredGroupItems ] = useState<GroupItem[]>(null)
    const [ countdownTick, setCountdownTick ] = useState(3)
    const [ quantity, setQuantity ] = useState<number>(1)
    const [ furnitureName, setFurnitureName ] = useState<string>("")
    const { ownUser = null, otherUser = null, groupItems = [], tradeState = TradeState.TRADING_STATE_READY, progressTrade = null, removeItem = null, setTradeState = null } = useInventoryTrade()
    const { simpleAlert = null } = useNotification()

    const MAX_ITEMS_TO_TRADE: number = 9

    useEffect(() =>
    {
        if(!groupItem || !roomPreviewer) return

        const furnitureItem = groupItem.getLastItem()

        if(!furnitureItem) return

        const roomEngine = GetRoomEngine()

        let wallType = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_WALL_TYPE)
        let floorType = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_FLOOR_TYPE)
        let landscapeType = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_LANDSCAPE_TYPE)

        wallType = (wallType && wallType.length) ? wallType : "101"
        floorType = (floorType && floorType.length) ? floorType : "101"
        landscapeType = (landscapeType && landscapeType.length) ? landscapeType : "1.1"

        roomPreviewer.reset(false)
        roomPreviewer.updateObjectRoom(floorType, wallType, landscapeType)
        roomPreviewer.updateRoomWallsAndFloorVisibility(false, false)

        if((furnitureItem.category === FurniCategory.WALL_PAPER) || (furnitureItem.category === FurniCategory.FLOOR) || (furnitureItem.category === FurniCategory.LANDSCAPE))
        {
            floorType = ((furnitureItem.category === FurniCategory.FLOOR) ? groupItem.stuffData.getLegacyString() : floorType)
            wallType = ((furnitureItem.category === FurniCategory.WALL_PAPER) ? groupItem.stuffData.getLegacyString() : wallType)
            landscapeType = ((furnitureItem.category === FurniCategory.LANDSCAPE) ? groupItem.stuffData.getLegacyString() : landscapeType)

            roomPreviewer.updateObjectRoom(floorType, wallType, landscapeType)

            if(furnitureItem.category === FurniCategory.LANDSCAPE)
            {
                const data = GetSessionDataManager().getWallItemDataByName("window_double_default")

                if(data) roomPreviewer.addWallItemIntoRoom(data.id, new Vector3d(90, 0, 0), data.customParams)
            }
        }
        else
        {
            if(groupItem.isWallItem)
            {
                roomPreviewer.addWallItemIntoRoom(groupItem.type, new Vector3d(90), furnitureItem.stuffData.getLegacyString())
            }
            else
            {
                roomPreviewer.addFurnitureIntoRoom(groupItem.type, new Vector3d(90), groupItem.stuffData, (furnitureItem.extra.toString()))
            }
        }
    }, [ roomPreviewer, groupItem ])

    const canTradeItem = (isWallItem: boolean, spriteId: number, category: number, groupable: boolean, stuffData: IObjectData) =>
    {
        if(!ownUser || ownUser.accepts || !ownUser.userItems) return false

        if(ownUser.userItems.length < MAX_ITEMS_TO_TRADE) return true

        if(!groupable) return false

        let type = spriteId.toString()

        if(category === FurniCategory.POSTER)
        {
            type = ((type + "poster") + stuffData.getLegacyString())
        }
        else
        {
            if(category === FurniCategory.GUILD_FURNI)
            {
                type = getGuildFurniType(spriteId, stuffData)
            }
            else
            {
                type = (((isWallItem) ? "I" : "S") + type)
            }
        }

        return !!ownUser.userItems.getValue(type)
    }

    const attemptItemOffer = (count: number) =>
    {
        if(!groupItem) return

        const tradeItems = groupItem.getTradeItems(count)

        if(!tradeItems || !tradeItems.length) return

        let coreItem: IFurnitureItem = null
        const itemIds: number[] = []

        for(const item of tradeItems)
        {
            itemIds.push(item.id)

            if(!coreItem) coreItem = item
        }

        const ownItemCount = ownUser.userItems.length

        if((ownItemCount + itemIds.length) <= 1500)
        {
            if(!coreItem.isGroupable && (itemIds.length))
            {
                SendMessageComposer(new TradingListAddItemComposer(itemIds.pop()))
            }
            else
            {
                const tradeIds: number[] = []

                for(const itemId of itemIds)
                {
                    if(canTradeItem(coreItem.isWallItem, coreItem.type, coreItem.category, coreItem.isGroupable, coreItem.stuffData))
                    {
                        tradeIds.push(itemId)
                    }
                }

                if(tradeIds.length)
                {
                    if(tradeIds.length === 1)
                    {
                        SendMessageComposer(new TradingListAddItemComposer(tradeIds.pop()))
                    }
                    else
                    {
                        SendMessageComposer(new TradingListAddItemsComposer(...tradeIds))
                    }
                }
            }
        }
        else
        {
            simpleAlert(LocalizeText("trading.items.too_many_items.desc"), NotificationAlertType.DEFAULT, null, null, LocalizeText("trading.items.too_many_items.title"))
        }
    }
    
    const getTotalCredits = (items: AdvancedMap<string, GroupItem>): number =>
    {
        return items.getValues().map(item => Number(item.iconUrl.split("/")[item.iconUrl.split("/").length - 1]?.split("_")[1]) * item.items.length).reduce((acc, cur) => acc + (isNaN(cur) ? 0 : cur), 0)
    }

    const updateQuantity = (value: number, totalItemCount: number) =>
    {
        if(isNaN(Number(value)) || Number(value) < 0 || !value) value = 1

        value = Math.max(Number(value), 1)
        value = Math.min(Number(value), totalItemCount)

        if(value === quantity) return

        setQuantity(value)
    }

    const changeCount = (totalItemCount: number) =>
    {
        updateQuantity(quantity, totalItemCount)
        attemptItemOffer(quantity)
    }

    useEffect(() =>
    {
        setQuantity(1)
    }, [ groupItem ])

    useEffect(() =>
    {
        if(tradeState !== TradeState.TRADING_STATE_COUNTDOWN) return

        setCountdownTick(3)

        const interval = setInterval(() =>
        {
            setCountdownTick(prevValue =>
            {
                const newValue = (prevValue - 1)

                if(newValue === 0) clearInterval(interval)

                return newValue
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [ tradeState, setTradeState ])

    useEffect(() =>
    {
        if(countdownTick !== 0) return

        setTradeState(TradeState.TRADING_STATE_CONFIRMING)
    }, [ countdownTick, setTradeState ])

    if((tradeState === TradeState.TRADING_STATE_READY) || !ownUser || !otherUser) return null

    return (
        <div className="flex w-full flex-col pb-2.5">
            <div className="relative mb-2.5 flex h-[270px] gap-2.5">
                <div className="relative flex flex-col justify-between">
                    <div className="h-[calc(100%-33px)] w-[246px] pb-2">
                        <div className="illumina-scrollbar grid size-full !grid-cols-[repeat(5,minmax(43px,0fr))] !grid-rows-[repeat(auto-fit,minmax(43px,0fr))] !gap-[3px] pt-0.5">
                            { filteredGroupItems && (filteredGroupItems.length > 0) && filteredGroupItems.map((item, index) =>
                            {
                                const count = item.getUnlockedCount()

                                return (
                                    <LayoutGridItem key={ index } className={ !count ? "has-trade" : "" } itemImage={ item.iconUrl } itemCount={ count } itemActive={ (groupItem === item) } itemUniqueNumber={ item.stuffData.uniqueNumber } onClick={ event => (setGroupItem(item)) } onDoubleClick={ event => attemptItemOffer(1) } />
                                )
                            })
                            }
                        </div>
                    </div>
                    <InventoryFurnitureSearchView groupItems={ groupItems } setGroupItems={ setFilteredGroupItems } />
                </div>
                <div className="flex w-[214px] flex-col justify-between">
                    {groupItem !== null &&
                    <>
                        <div className="relative flex h-full max-h-[246px] flex-col pb-3">
                            <LayoutRoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 }>
                                <p className="mt-1.5 break-words text-center text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ groupItem?.name }</p>
                            </LayoutRoomPreviewerView>
                            { groupItem && groupItem.stuffData.isUnique &&
                                <LayoutLimitedEditionCompactPlateView className="absolute right-2 top-2" uniqueNumber={ groupItem.stuffData.uniqueNumber } uniqueSeries={ groupItem.stuffData.uniqueSeries } /> }
                            { (groupItem && groupItem.stuffData.rarityLevel > -1) &&
                                <LayoutRarityLevelView className="absolute right-2 top-2" level={ groupItem.stuffData.rarityLevel } /> }
                        </div>
                        <div className="flex flex-col gap-[3px]">
                            <div className="illumina-input relative h-[25px] w-[52px]">
                                <input type="number" className="size-full bg-transparent px-[9px] text-[13px] text-black" disabled={ !groupItem } value={ quantity } onChange={ event => setQuantity(event.target.valueAsNumber) } />
                            </div>
                            <Button variant="primary" disabled={ !groupItem } onClick={ event => changeCount(groupItem.getUnlockedCount()) }>{ LocalizeText("inventory.trading.offer") }</Button>
                        </div>
                    </> }
                </div>
            </div>
            <div className="illumina-previewer p-3">
                <p className="text-sm [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("inventory.trading.info.add") }</p>
                <div className="flex h-full p-3 pb-0">
                    <div className="flex w-[180px] flex-col">
                        <p className="pb-[11px] text-sm [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]"><b className="font-bold">{ LocalizeText("inventory.trading.you") }</b> { LocalizeText("inventory.trading.areoffering") }</p>
                        <div className="flex flex-col">
                            <div className="flex items-end gap-[15px]">
                                <div className="grid grid-cols-[repeat(3,minmax(40px,0fr))] grid-rows-[repeat(3,minmax(40px,0fr))] gap-[3px]">
                                    { Array.from(Array(MAX_ITEMS_TO_TRADE), (e, i) =>
                                    {
                                        const item = (ownUser.userItems.getWithIndex(i) || null)

                                        if(!item) return <LayoutGridItem className="w-[43px]" key={ i } />

                                        return (
                                            <LayoutGridItem className="w-[43px]" key={ i } itemActive={ (ownGroupItem === item) } itemImage={ item.iconUrl } itemCount={ item.getTotalCount() } itemUniqueNumber={ item.stuffData.uniqueNumber } onClick={ event => removeItem(item) } />
                                        )
                                    }) }
                                </div>
                                {ownUser.accepts
                                    ? <i className="h-11 w-9 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-38px_0px]" /> 
                                    : <i className="h-11 w-[29px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-74px_0px]" /> }
                            </div>
                            <div className="pt-3">
                                <p className="text-sm [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("inventory.trading.info.itemcount", [ "value" ], [ ownUser.itemCount.toString() ]) }</p>
                                <p className="text-sm [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("inventory.trading.info.creditvalue.own", [ "value" ], [ getTotalCredits(ownUser.userItems).toString() ]) }</p>
                            </div>
                        </div>
                    </div>
                    <div className="mx-[33px] h-auto w-0.5 border-r border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    <div className="flex w-[180px] flex-col">
                        <p className="pb-[11px] text-sm [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]"><b className="font-bold">{ otherUser.userName }</b> { LocalizeText("inventory.trading.isoffering") }</p>
                        <div className="flex flex-col">
                            <div className="flex items-end gap-[15px]">
                                <div className="grid grid-cols-[repeat(3,minmax(40px,0fr))] grid-rows-[repeat(3,minmax(40px,0fr))] gap-[3px]">
                                    { Array.from(Array(MAX_ITEMS_TO_TRADE), (e, i) =>
                                    {
                                        const item = (otherUser.userItems.getWithIndex(i) || null)

                                        if(!item) return <LayoutGridItem className="w-[43px]" key={ i } />

                                        return <LayoutGridItem className="w-[43px]" key={ i } itemActive={ (otherGroupItem === item) } itemImage={ item.iconUrl } itemCount={ item.getTotalCount() } itemUniqueNumber={ item.stuffData.uniqueNumber } />
                                    }) }
                                </div>
                                {otherUser.accepts
                                    ? <i className="h-11 w-9 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-38px_0px]" /> 
                                    : <i className="h-11 w-[29px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-74px_0px]" /> }
                            </div>
                            <div className="pt-3">
                                <p className="text-sm [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("inventory.trading.info.itemcount", [ "value" ], [ otherUser.itemCount.toString() ]) }</p>
                                <p className="text-sm [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("inventory.trading.info.creditvalue", [ "value" ], [ getTotalCredits(otherUser.userItems).toString() ]) }</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between pt-8">
                { (tradeState === TradeState.TRADING_STATE_READY) &&
                     <Button variant="primary" disabled= {(!ownUser.itemCount && !otherUser.itemCount)} onClick={progressTrade} >{LocalizeText("inventory.trading.accept")}</Button>}
                { (tradeState === TradeState.TRADING_STATE_RUNNING) &&
                    <Button variant="primary" disabled={(!ownUser.itemCount && !otherUser.itemCount)} onClick={ !ownUser.itemCount && !otherUser.itemCount ? null : progressTrade }>{ LocalizeText(ownUser.accepts ? "inventory.trading.modify" : "inventory.trading.accept") }</Button> }
                { (tradeState === TradeState.TRADING_STATE_COUNTDOWN) &&
                    <Button variant="primary" disabled>{ LocalizeText("inventory.trading.countdown", [ "counter" ], [ countdownTick.toString() ]) }</Button> }
                { (tradeState === TradeState.TRADING_STATE_CONFIRMING) &&
                    <Button variant="primary" onClick={ progressTrade }>{ LocalizeText("inventory.trading.confirm") }</Button> }
                { (tradeState === TradeState.TRADING_STATE_CONFIRMED) &&
                    <Button variant="primary" disabled={true}>{ LocalizeText("inventory.trading.info.waiting") }</Button> }
                <Button variant="primary" onClick={ cancelTrade }>{ LocalizeText("generic.cancel") }</Button>
            </div>
        </div>
    )
}
