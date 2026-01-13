import { IRoomSession, RoomObjectVariable, RoomPreviewer } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { GetRoomEngine, LocalizeText, UnseenItemCategory, attemptPetPlacement } from "../../../../api"
import { Button, LayoutRoomPreviewerView } from "../../../../common"
import { useInventoryPets, useInventoryUnseenTracker } from "../../../../hooks"
import { InventoryCategoryEmptyView } from "../InventoryCategoryEmptyView"
import { InventoryPetItemView } from "./InventoryPetItemView"

interface InventoryPetViewProps
{
    roomSession: IRoomSession;
    roomPreviewer: RoomPreviewer;
}

export const InventoryPetView: FC<InventoryPetViewProps> = props =>
{
    const { roomSession = null, roomPreviewer = null } = props
    const [ isVisible, setIsVisible ] = useState(false)
    const { petItems = null, selectedPet = null, activate = null, deactivate = null } = useInventoryPets()
    const { isUnseen = null, removeUnseen = null } = useInventoryUnseenTracker()

    useEffect(() =>
    {
        if(!selectedPet || !roomPreviewer) return

        const petData = selectedPet.petData
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
        roomPreviewer.addPetIntoRoom(petData.figureString)
    }, [ roomPreviewer, selectedPet ])

    useEffect(() =>
    {
        if(!selectedPet || !isUnseen(UnseenItemCategory.PET, selectedPet.petData.id)) return

        removeUnseen(UnseenItemCategory.PET, selectedPet.petData.id)
    }, [ selectedPet, isUnseen, removeUnseen ])

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

    if(!petItems || !petItems.length) return <InventoryCategoryEmptyView title={ LocalizeText("inventory.empty.pets.title") } desc={ LocalizeText("inventory.empty.pets.desc") } />

    return (
        <div className="flex h-[270px] w-full gap-2.5">
            <div className="relative flex flex-col justify-between">
                <div className="h-[calc(100%-33px)] w-[246px] pb-2">
                    <div className="illumina-scrollbar grid size-full !grid-cols-[repeat(5,minmax(43px,0fr))] !grid-rows-[repeat(auto-fit,minmax(43px,0fr))] !gap-[3px] pt-0.5">
                        { petItems && (petItems.length > 0) && petItems.map(item => <InventoryPetItemView key={ item.petData.id } petItem={ item } />) }
                    </div>
                </div>
            </div>
            <div className="flex w-full flex-col justify-between">
                <div className="relative flex size-full max-h-[246px] flex-col pb-3">
                    <LayoutRoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 }>
                        <p className="mt-1.5 break-words text-center text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ selectedPet.petData.name }</p>
                    </LayoutRoomPreviewerView>
                </div>
                { selectedPet && selectedPet.petData &&
                    <>
                        { !!roomSession &&
                            <Button variant="success" onClick={ event => attemptPetPlacement(selectedPet) }>
                                { LocalizeText("inventory.furni.placetoroom") }
                            </Button> }
                    </> }
            </div>
        </div>
    )
}
