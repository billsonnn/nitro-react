import { RequestPetsComposer, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { GetRoomEngine, LocalizeText } from '../../../../api';
import { SendMessageHook } from '../../../../hooks/messages/message-event';
import { NitroLayoutBase } from '../../../../layout/base';
import { NitroLayoutFlexColumn } from '../../../../layout/flex-column/NitroLayoutFlexColumn';
import { NitroLayoutGridColumn } from '../../../../layout/grid/column/NitroLayoutGridColumn';
import { NitroLayoutGrid } from '../../../../layout/grid/NitroLayoutGrid';
import { RoomPreviewerView } from '../../../shared/room-previewer/RoomPreviewerView';
import { attemptPetPlacement } from '../../common/PetUtilities';
import { useInventoryContext } from '../../context/InventoryContext';
import { InventoryPetActions } from '../../reducers/InventoryPetReducer';
import { InventoryCategoryEmptyView } from '../category-empty/InventoryCategoryEmptyView';
import { InventoryPetViewProps } from './InventoryPetView.types';
import { InventoryPetResultsView } from './results/InventoryPetResultsView';

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

        let wallType        = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_WALL_TYPE);
        let floorType       = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_FLOOR_TYPE);
        let landscapeType   = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_LANDSCAPE_TYPE);

        wallType        = (wallType && wallType.length) ? wallType : '101';
        floorType       = (floorType && floorType.length) ? floorType : '101';
        landscapeType   = (landscapeType && landscapeType.length) ? landscapeType : '1.1';

        roomPreviewer.reset(false);
        roomPreviewer.updateRoomWallsAndFloorVisibility(true, true);
        roomPreviewer.updateObjectRoom(floorType, wallType, landscapeType);
        roomPreviewer.addPetIntoRoom(petData.figureString);
    }, [ roomPreviewer, petItem ]);

    if(!petItems || !petItems.length) return <InventoryCategoryEmptyView title={ LocalizeText('inventory.empty.pets.title') } desc={ LocalizeText('inventory.empty.pets.desc') } />;

    return (
        <NitroLayoutGrid>
            <NitroLayoutGridColumn size={ 7 }>
                <InventoryPetResultsView petItems={ petItems }  />
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn size={ 5 } overflow="auto">
                <NitroLayoutFlexColumn overflow="hidden" position="relative">
                    <RoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                </NitroLayoutFlexColumn>
                { petItem &&
                    <NitroLayoutFlexColumn className="flex-grow-1" gap={ 2 }>
                        <NitroLayoutBase className="flex-grow-1 text-black text-truncate">{ petItem.petData.name }</NitroLayoutBase>
                        { !!roomSession && <button type="button" className="btn btn-success btn-sm" onClick={ event => attemptPetPlacement(petItem) }>{ LocalizeText('inventory.furni.placetoroom') }</button> }
                    </NitroLayoutFlexColumn> }
            </NitroLayoutGridColumn>
        </NitroLayoutGrid>
    );
}
