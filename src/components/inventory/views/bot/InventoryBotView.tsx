import { IRoomSession, RoomObjectVariable, RoomPreviewer } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { GetRoomEngine, LocalizeText, UnseenItemCategory, attemptBotPlacement } from "../../../../api"
import { Button, LayoutRoomPreviewerView } from "../../../../common"
import { useInventoryBots, useInventoryUnseenTracker } from "../../../../hooks"
import { InventoryCategoryEmptyView } from "../InventoryCategoryEmptyView"
import { InventoryBotItemView } from "./InventoryBotItemView"

interface InventoryBotViewProps
{
    roomSession: IRoomSession;
    roomPreviewer: RoomPreviewer;
}

export const InventoryBotView: FC<InventoryBotViewProps> = props =>
{
    const { roomSession = null, roomPreviewer = null } = props
    const [ isVisible, setIsVisible ] = useState(false)
    const { botItems = [], selectedBot = null, activate = null, deactivate = null } = useInventoryBots()
    const { isUnseen = null, removeUnseen = null } = useInventoryUnseenTracker()

    useEffect(() =>
    {
        if(!selectedBot || !roomPreviewer) return

        const botData = selectedBot.botData

        const roomEngine = GetRoomEngine()

        let wallType = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_WALL_TYPE)
        let floorType = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_FLOOR_TYPE)
        let landscapeType = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_LANDSCAPE_TYPE)

        wallType = (wallType && wallType.length) ? wallType : "101"
        floorType = (floorType && floorType.length) ? floorType : "101"
        landscapeType = (landscapeType && landscapeType.length) ? landscapeType : "1.1"

        roomPreviewer.reset(false)
        roomPreviewer.updateRoomWallsAndFloorVisibility(false, false)
        roomPreviewer.updateObjectRoom(floorType, wallType, landscapeType)
        roomPreviewer.addAvatarIntoRoom(botData.figure, 0)
    }, [ roomPreviewer, selectedBot ])

    useEffect(() =>
    {
        if(!selectedBot || !isUnseen(UnseenItemCategory.BOT, selectedBot.botData.id)) return

        removeUnseen(UnseenItemCategory.BOT, selectedBot.botData.id)
    }, [ selectedBot, isUnseen, removeUnseen ])

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

    if(!botItems || !botItems.length) return <InventoryCategoryEmptyView title={ LocalizeText("inventory.empty.bots.title") } desc={ LocalizeText("inventory.empty.bots.desc") } />

    return (
        <div className="flex h-[270px] w-full gap-2.5">
            <div className="relative flex flex-col justify-between">
                <div className="mb-2 h-[calc(100%-33px)] w-[246px]">
                    <div className="illumina-scrollbar grid size-full !grid-cols-[repeat(5,minmax(43px,0fr))] !grid-rows-[repeat(auto-fit,minmax(43px,0fr))] !gap-[3px] pt-0.5">
                        { botItems && (botItems.length > 0) && botItems.map(item => <InventoryBotItemView key={ item.botData.id } botItem={ item } />) }
                    </div>
                </div>
            </div>
            <div className="flex w-full flex-col justify-between">
                <div className="relative flex h-full max-h-[246px] flex-col pb-3">
                    <LayoutRoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 }>
                        <p className="mt-1.5 break-words text-center text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ selectedBot.botData.name }</p>
                    </LayoutRoomPreviewerView>
                </div>
                { selectedBot &&
                    <>
                        { !!roomSession &&
                            <Button variant="success" onClick={ event => attemptBotPlacement(selectedBot) }>
                                { LocalizeText("inventory.furni.placetoroom") }
                            </Button> }
                    </> }
            </div>
        </div>
    )
}
