import { RequestPetsComposer, RoomObjectVariable } from 'nitro-renderer';
import { FC, useEffect } from 'react';
import { GetRoomEngine } from '../../../../api';
import { SendMessageHook } from '../../../../hooks/messages/message-event';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { RoomPreviewerView } from '../../../room-previewer/RoomPreviewerView';
import { useInventoryContext } from '../../context/InventoryContext';
import { InventoryPetActions } from '../../reducers/InventoryPetReducer';
import { attemptPetPlacement } from '../../utils/PetUtilities';
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
        roomPreviewer.addPetIntoRoom(petData.figureData.figuredata);
    }, [ roomPreviewer, petItem ]);

    if(!petItems || !petItems.length)
    {
        return (
            <div className="row h-100">
                <div className="col-5 d-flex justify-content-center align-items-center">
                    <div className="empty-image"></div>
                </div>
                <div className="d-flex flex-column col-7 justify-content-center">
                    <div className="h5 m-0 text-black fw-bold m-0 mb-2">
                        { LocalizeText('inventory.empty.pets.title') }
                    </div>
                    <div className="h6 text-black">{ LocalizeText('inventory.empty.pets.desc') }</div>
                </div>
            </div>
        );
    }

    return (
        <div className="row h-100">
            <div className="col-7 d-flex flex-column h-100">
                <InventoryPetResultsView petItems={ petItems }  />
            </div>
            <div className="d-flex flex-column col-5 justify-space-between">
                <RoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                { petItem && <div className="d-flex flex-column flex-grow-1">
                    <p className="flex-grow-1 fs-6 text-black my-2">{ petItem.petData.name }</p>
                    { !!roomSession && <button type="button" className="btn btn-success btn-sm" onClick={ event => attemptPetPlacement(petItem) }>{ LocalizeText('inventory.furni.placetoroom') }</button> }
                </div> }
            </div>
        </div>
    );
}
