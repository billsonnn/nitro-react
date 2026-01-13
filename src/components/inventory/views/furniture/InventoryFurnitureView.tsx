import { IRoomSession, RoomObjectVariable, RoomPreviewer, Vector3d } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { DispatchUiEvent, FurniCategory, GetRoomEngine, GetSessionDataManager, GroupItem, LocalizeText, UnseenItemCategory, attemptItemPlacement } from "../../../../api"
import { Button, LayoutLimitedEditionCompactPlateView, LayoutRarityLevelView, LayoutRoomPreviewerView } from "../../../../common"
import { CatalogPostMarketplaceOfferEvent } from "../../../../events"
import { useInventoryFurni, useInventoryUnseenTracker } from "../../../../hooks"
import { InventoryCategoryEmptyView } from "../InventoryCategoryEmptyView"
import { InventoryFurnitureItemView } from "./InventoryFurnitureItemView"
import { InventoryFurnitureSearchView } from "./InventoryFurnitureSearchView"

interface InventoryFurnitureViewProps
{
    roomSession: IRoomSession;
    roomPreviewer: RoomPreviewer;
}

const attemptPlaceMarketplaceOffer = (groupItem: GroupItem) =>
{
    const item = groupItem.getLastItem()

    if(!item) return false

    if(!item.sellable) return false

    DispatchUiEvent(new CatalogPostMarketplaceOfferEvent(item))
}

export const InventoryFurnitureView: FC<InventoryFurnitureViewProps> = props =>
{
    const { roomSession = null, roomPreviewer = null } = props
    const [ isVisible, setIsVisible ] = useState(false)
    const [ filteredGroupItems, setFilteredGroupItems ] = useState<GroupItem[]>([])
    const { groupItems = [], selectedItem = null, activate = null, deactivate = null } = useInventoryFurni()
    const { resetItems = null } = useInventoryUnseenTracker()

    useEffect(() =>
    {
        if(!selectedItem || !roomPreviewer) return

        const furnitureItem = selectedItem.getLastItem()

        if(!furnitureItem) return

        const roomEngine = GetRoomEngine()

        let wallType = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_WALL_TYPE)
        let floorType = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_FLOOR_TYPE)
        let landscapeType = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_LANDSCAPE_TYPE)

        wallType = (wallType && wallType.length) ? wallType : "101"
        floorType = (floorType && floorType.length) ? floorType : "101"
        landscapeType = (landscapeType && landscapeType.length) ? landscapeType : "1.1"

        roomPreviewer.reset(true)
        roomPreviewer.updateObjectRoom(floorType, wallType, landscapeType)

        setTimeout(() => {
            roomPreviewer.updateRoomWallsAndFloorVisibility(false, false)
        }, 30)

        if((furnitureItem.category === FurniCategory.WALL_PAPER) || (furnitureItem.category === FurniCategory.FLOOR) || (furnitureItem.category === FurniCategory.LANDSCAPE))
        {
            floorType = ((furnitureItem.category === FurniCategory.FLOOR) ? selectedItem.stuffData.getLegacyString() : floorType)
            wallType = ((furnitureItem.category === FurniCategory.WALL_PAPER) ? selectedItem.stuffData.getLegacyString() : wallType)
            landscapeType = ((furnitureItem.category === FurniCategory.LANDSCAPE) ? selectedItem.stuffData.getLegacyString() : landscapeType)

            roomPreviewer.updateObjectRoom(floorType, wallType, landscapeType)

            if(furnitureItem.category === FurniCategory.LANDSCAPE)
            {
                const data = GetSessionDataManager().getWallItemDataByName("window_double_default")

                if(data) roomPreviewer.addWallItemIntoRoom(data.id, new Vector3d(90, 0, 0), data.customParams)
            }
        }
        else
        {
            if(selectedItem.isWallItem)
            {
                roomPreviewer.addWallItemIntoRoom(selectedItem.type, new Vector3d(90), furnitureItem.stuffData.getLegacyString())
            }
            else
            {
                roomPreviewer.addFurnitureIntoRoom(selectedItem.type, new Vector3d(90), selectedItem.stuffData, (furnitureItem.extra.toString()))
            }
        }
    }, [ roomPreviewer, selectedItem ])

    useEffect(() =>
    {
        if(!selectedItem || !selectedItem.hasUnseenItems) return

        resetItems(UnseenItemCategory.FURNI, selectedItem.items.map(item => item.id))

        selectedItem.hasUnseenItems = false
    }, [ selectedItem, resetItems ])

    useEffect(() =>
    {
        if(!isVisible) return

        const id = activate()

        return () => deactivate(id)
    }, [ isVisible, activate, deactivate ])

    useEffect(() =>
    {
        setIsVisible(true)

        return () => setIsVisible(false)
    }, [])

    if(!groupItems || !groupItems.length) return <InventoryCategoryEmptyView title={ LocalizeText("inventory.empty.title") } desc={ LocalizeText("inventory.empty.desc") } />

    return (
        <div className="flex h-[270px] w-full gap-2.5">
            <div className="relative flex flex-col justify-between">
                <div className="h-[calc(100%-33px)] w-[246px] pb-2">
                    <div className="illumina-scrollbar grid size-full !grid-cols-[repeat(5,minmax(43px,0fr))] !grid-rows-[repeat(auto-fit,minmax(43px,0fr))] !gap-[3px] pt-0.5">
                        { filteredGroupItems && (filteredGroupItems.length > 0) && filteredGroupItems.map((item, index) => <InventoryFurnitureItemView key={ index } groupItem={ item } />) }
                    </div>
                </div>
                <InventoryFurnitureSearchView groupItems={ groupItems } setGroupItems={ setFilteredGroupItems } />
            </div>
            <div className="flex w-full flex-col justify-between">
                <div className="relative flex h-full max-h-[246px] flex-col pb-3">
                    <LayoutRoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 }>
                        <p className="mt-1.5 break-words text-center text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ selectedItem.name }</p>
                    </LayoutRoomPreviewerView>
                    { selectedItem && selectedItem.stuffData.isUnique &&
                        <LayoutLimitedEditionCompactPlateView className="absolute right-2 top-2" uniqueNumber={ selectedItem.stuffData.uniqueNumber } uniqueSeries={ selectedItem.stuffData.uniqueSeries } /> }
                    { (selectedItem && selectedItem.stuffData.rarityLevel > -1) &&
                        <LayoutRarityLevelView className="absolute right-2 top-2" level={ selectedItem.stuffData.rarityLevel } /> }
                </div>
                { selectedItem && <div className="flex flex-col gap-1">
                    { !!roomSession &&
                        <Button variant="success" onClick={ event => attemptItemPlacement(selectedItem) }>
                            { LocalizeText("inventory.furni.placetoroom") }
                        </Button> }
                    { (selectedItem && selectedItem.isSellable) &&
                        <Button onClick={ event => attemptPlaceMarketplaceOffer(selectedItem) }>
                            { LocalizeText("inventory.marketplace.sell") }
                        </Button> }
                </div> }
            </div>
        </div>
    )
}
