import { IRoomSession, MouseEventType, RoomObjectVariable, RoomPreviewer } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useEffect, useState } from 'react';
import { attemptPetPlacement, GetRoomEngine, IPetItem, LocalizeText, UnseenItemCategory } from '../../../api';
import { AutoGrid, Button, Column, Grid, LayoutGridItem, LayoutPetImageView, LayoutRoomPreviewerView, Text } from '../../../common';
import { useInventoryPets, useInventoryUnseenTracker } from '../../../hooks';
import { InventoryCategoryEmptyView } from './InventoryCategoryEmptyView';

interface InventoryPetViewProps
{
    roomSession: IRoomSession;
    roomPreviewer: RoomPreviewer;
}

export const InventoryPetView: FC<InventoryPetViewProps> = props =>
{
    const { roomSession = null, roomPreviewer = null } = props;
    const { petItems = null, selectedPet = null, selectPet = null } = useInventoryPets();
    const { getCount = null, resetCategory = null, isUnseen = null, removeUnseen = null } = useInventoryUnseenTracker();

    useEffect(() =>
    {
        if(!petItems || !petItems.length) return;
        
        return () =>
        {
            const count = getCount(UnseenItemCategory.PET);

            if(!count) return;

            resetCategory(UnseenItemCategory.PET);
        }
    }, [ petItems, getCount, resetCategory ]);

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

    if(!petItems || !petItems.length) return <InventoryCategoryEmptyView title={ LocalizeText('inventory.empty.pets.title') } desc={ LocalizeText('inventory.empty.pets.desc') } />;

    const InventoryPetItemView: FC<{ petItem: IPetItem }> = props =>
    {
        const { petItem = null } = props;
        const [ isMouseDown, setMouseDown ] = useState(false);
        const isActive = (petItem === selectedPet);
        const unseen = isUnseen(UnseenItemCategory.PET, petItem.petData.id);

        const onMouseEvent = (event: MouseEvent) =>
        {
            switch(event.type)
            {
                case MouseEventType.MOUSE_DOWN:
                    selectPet(petItem);

                    if(unseen) removeUnseen(UnseenItemCategory.PET, petItem.petData.id);

                    setMouseDown(true);
                    return;
                case MouseEventType.MOUSE_UP:
                    setMouseDown(false);
                    return;
                case MouseEventType.ROLL_OUT:
                    if(!isMouseDown || !isActive) return;

                    attemptPetPlacement(petItem);
                    return;
            }
        }
        
        return (
            <LayoutGridItem itemActive={ isActive } itemUnseen={ unseen } onMouseDown={ onMouseEvent } onMouseUp={ onMouseEvent } onMouseOut={ onMouseEvent }>
                <LayoutPetImageView figure={ petItem.petData.figureData.figuredata } direction={ 3 } headOnly={ true } />
            </LayoutGridItem>
        );
    }

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
