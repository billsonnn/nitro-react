import { GetRoomEngine, IRoomSession, RoomObjectVariable, RoomPreviewer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { LocalizeText, UnseenItemCategory, attemptPetPlacement } from '../../../../api';
import { AutoGrid, Button, Column, Grid, LayoutRoomPreviewerView, Text } from '../../../../common';
import { useInventoryPets, useInventoryUnseenTracker } from '../../../../hooks';
import { InventoryCategoryEmptyView } from '../InventoryCategoryEmptyView';
import { InventoryPetItemView } from './InventoryPetItemView';

interface InventoryPetViewProps
{
    roomSession: IRoomSession;
    roomPreviewer: RoomPreviewer;
}

export const InventoryPetView: FC<InventoryPetViewProps> = props =>
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

    if(!petItems || !petItems.length) return <InventoryCategoryEmptyView title={ LocalizeText('inventory.empty.pets.title') } desc={ LocalizeText('inventory.empty.pets.desc') } />;

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <AutoGrid columnCount={ 5 }>
                    { petItems && (petItems.length > 0) && petItems.map(item => <InventoryPetItemView key={ item.petData.id } petItem={ item } />) }
                </AutoGrid>
            </Column>
            <Column size={ 5 } overflow="auto">
                <Column overflow="hidden" position="relative">
                    <LayoutRoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                </Column>
                { selectedPet && selectedPet.petData &&
                    <Column grow justifyContent="between" gap={ 2 }>
                        <Text grow truncate>{ selectedPet.petData.name }</Text>
                        { !!roomSession &&
                            <Button variant="success" onClick={ event => attemptPetPlacement(selectedPet) }>
                                { LocalizeText('inventory.furni.placetoroom') }
                            </Button> }
                    </Column> }
            </Column>
        </Grid>
    );
}
