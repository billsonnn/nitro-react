import { IRoomSession, RequestPetsComposer, RoomObjectVariable, RoomPreviewer } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { GetRoomEngine, LocalizeText } from '../../../../api';
import { AutoGrid } from '../../../../common/AutoGrid';
import { Button } from '../../../../common/Button';
import { Column } from '../../../../common/Column';
import { Grid } from '../../../../common/Grid';
import { Text } from '../../../../common/Text';
import { SendMessageHook } from '../../../../hooks/messages/message-event';
import { RoomPreviewerView } from '../../../../views/shared/room-previewer/RoomPreviewerView';
import { attemptPetPlacement } from '../../common/PetUtilities';
import { useInventoryContext } from '../../InventoryContext';
import { InventoryPetActions } from '../../reducers/InventoryPetReducer';
import { InventoryCategoryEmptyView } from '../category-empty/InventoryCategoryEmptyView';
import { InventoryPetItemView } from './InventoryPetItemView';

export interface InventoryPetViewProps
{
    roomSession: IRoomSession;
    roomPreviewer: RoomPreviewer;
}

export const InventoryPetView: FC<InventoryPetViewProps> = props =>
{
    const { roomSession = null, roomPreviewer = null } = props;
    const { petState = null, dispatchPetState = null } = useInventoryContext();
    const { needsPetUpdate = false, petItem = null, petItems = [] } = petState;

    useEffect(() =>
    {
        if(needsPetUpdate)
        {
            dispatchPetState({
                type: InventoryPetActions.SET_NEEDS_UPDATE,
                payload: {
                    flag: false
                }
            });
            
            SendMessageHook(new RequestPetsComposer());
        }
        else
        {
            dispatchPetState({
                type: InventoryPetActions.SET_PET_ITEM,
                payload: {
                    petItem: null
                }
            });
        }

    }, [ needsPetUpdate, petItems, dispatchPetState ]);

    useEffect(() =>
    {
        if(!petItem || !roomPreviewer) return;

        const petData = petItem.petData;
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
    }, [ roomPreviewer, petItem ]);

    if(!petItems || !petItems.length) return <InventoryCategoryEmptyView title={ LocalizeText('inventory.empty.pets.title') } desc={ LocalizeText('inventory.empty.pets.desc') } />;

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <AutoGrid columnCount={ 5 }>
                    { petItems && (petItems.length > 0) && petItems.map(item => <InventoryPetItemView key={ item.id } petItem={ item } />) }
                </AutoGrid>
            </Column>
            <Column size={ 5 } overflow="auto">
                <Column overflow="hidden" position="relative">
                    <RoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                </Column>
                { petItem &&
                    <Column grow justifyContent="between" gap={ 2 }>
                        <Text grow truncate>{ petItem.petData.name }</Text>
                        { !!roomSession &&
                            <Button variant="success" onClick={ event => attemptPetPlacement(petItem) }>
                                { LocalizeText('inventory.furni.placetoroom') }
                            </Button> }
                    </Column> }
            </Column>
        </Grid>
    );
}
