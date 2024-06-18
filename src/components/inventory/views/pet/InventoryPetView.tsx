import { GetRoomEngine, IRoomSession, RoomObjectVariable, RoomPreviewer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { IPetItem, LocalizeText, UnseenItemCategory, attemptPetPlacement } from '../../../../api';
import { LayoutRoomPreviewerView } from '../../../../common';
import { useInventoryPets, useInventoryUnseenTracker } from '../../../../hooks';
import { InfiniteGrid, NitroButton } from '../../../../layout';
import { InventoryCategoryEmptyView } from '../InventoryCategoryEmptyView';
import { InventoryPetItemView } from './InventoryPetItemView';

export const InventoryPetView: FC<{
    roomSession: IRoomSession;
    roomPreviewer: RoomPreviewer;
}> = props =>
{
    const { roomSession = null, roomPreviewer = null } = props;
    const [ isVisible, setIsVisible ] = useState(false);
    const { petItems = null, selectedPet = null, activate = null, deactivate = null } = useInventoryPets();
    const { isUnseen = null, removeUnseen = null } = useInventoryUnseenTracker();

    useEffect(() =>
    {
        if(!selectedPet || !roomPreviewer) return;

        const petData = selectedPet.petData;
        const roomEngine = GetRoomEngine();

        let wallType = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_WALL_TYPE);
        let floorType = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_FLOOR_TYPE);
        let landscapeType = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_LANDSCAPE_TYPE);

        wallType = (wallType && wallType.length) ? wallType : '101';
        floorType = (floorType && floorType.length) ? floorType : '101';
        landscapeType = (landscapeType && landscapeType.length) ? landscapeType : '1.1';

        roomPreviewer.reset(false);
        roomPreviewer.updateRoomWallsAndFloorVisibility(true, true);
        roomPreviewer.updateObjectRoom(floorType, wallType, landscapeType);
        roomPreviewer.addPetIntoRoom(petData.figureString);
    }, [ roomPreviewer, selectedPet ]);

    useEffect(() =>
    {
        if(!selectedPet || !isUnseen(UnseenItemCategory.PET, selectedPet.petData.id)) return;

        removeUnseen(UnseenItemCategory.PET, selectedPet.petData.id);
    }, [ selectedPet, isUnseen, removeUnseen ]);

    useEffect(() =>
    {
        if(!isVisible) return;

        const id = activate();

        return () => deactivate(id);
    }, [ isVisible, activate, deactivate ]);

    useEffect(() =>
    {
        setIsVisible(true);

        return () => setIsVisible(false);
    }, []);

    if(!petItems || !petItems.length) return <InventoryCategoryEmptyView desc={ LocalizeText('inventory.empty.pets.desc') } title={ LocalizeText('inventory.empty.pets.title') } />;

    return (
        <div className="grid h-full grid-cols-12 gap-2">
            <div className="flex flex-col col-span-7 gap-1 overflow-hidden">
                <InfiniteGrid<IPetItem>
                    columnCount={ 6 }
                    itemRender={ item => <InventoryPetItemView petItem={ item } /> }
                    items={ petItems } />
            </div>
            <div className="flex flex-col col-span-5">
                <div className="relative flex flex-col">
                    <LayoutRoomPreviewerView height={ 140 } roomPreviewer={ roomPreviewer } />
                </div>
                { selectedPet && selectedPet.petData &&
                        <div className="flex flex-col justify-between gap-2 grow">
                            <span className="text-sm truncate grow">{ selectedPet.petData.name }</span>
                            { !!roomSession &&
                                <NitroButton onClick={ event => attemptPetPlacement(selectedPet) }>
                                    { LocalizeText('inventory.furni.placetoroom') }
                                </NitroButton> }
                        </div> }
            </div>
        </div>
    );
};
