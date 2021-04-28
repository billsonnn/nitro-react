import { FurnitureListComposer, RoomObjectVariable, Vector3d } from 'nitro-renderer';
import { FC, useEffect } from 'react';
import { GetRoomEngine } from '../../../../api';
import { SendMessageHook } from '../../../../hooks/messages/message-event';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { RoomPreviewerView } from '../../../room-previewer/RoomPreviewerView';
import { FurniCategory } from '../../utils/FurniCategory';
import { attemptItemPlacement } from '../../utils/FurnitureUtilities';
import { InventoryFurnitureViewProps } from './InventoryFurnitureView.types';
import { InventoryFurnitureItemView } from './item/InventoryFurnitureItemView';

export const InventoryFurnitureView: FC<InventoryFurnitureViewProps> = props =>
{
    const { needsFurniUpdate = false, setNeedsFurniUpdate = null, groupItem = null, setGroupItem = null, groupItems = null, roomSession = null, roomPreviewer = null } = props;

    console.log(props);

    useEffect(() =>
    {
        if(needsFurniUpdate)
        {
            setNeedsFurniUpdate(false);

            SendMessageHook(new FurnitureListComposer());
        }
        else
        {
            setGroupItem(prevValue =>
                {
                    if(!groupItems || !groupItems.length) return null;
                    
                    let index = 0;

                    if(prevValue)
                    {
                        const foundIndex = groupItems.indexOf(prevValue);

                        if(foundIndex > -1) index = foundIndex;
                    }

                    return groupItems[index];
                });
        }

    }, [ needsFurniUpdate, setNeedsFurniUpdate, groupItems, setGroupItem ]);

    useEffect(() =>
    {
        if(!groupItem || !roomPreviewer) return;

        const furnitureItem = groupItem.getLastItem();

        if(!furnitureItem) return;

        const roomEngine = GetRoomEngine();

        let wallType        = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_WALL_TYPE);
        let floorType       = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_FLOOR_TYPE);
        let landscapeType   = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_LANDSCAPE_TYPE);

        wallType        = (wallType && wallType.length) ? wallType : '101';
        floorType       = (floorType && floorType.length) ? floorType : '101';
        landscapeType   = (landscapeType && landscapeType.length) ? landscapeType : '1.1';

        roomPreviewer.reset(false);
        roomPreviewer.updateObjectRoom(floorType, wallType, landscapeType);
        roomPreviewer.updateRoomWallsAndFloorVisibility(true, true);

        if((furnitureItem.category === FurniCategory._Str_3639) || (furnitureItem.category === FurniCategory._Str_3683) || (furnitureItem.category === FurniCategory._Str_3432))
        {
            floorType       = ((furnitureItem.category === FurniCategory._Str_3683) ? groupItem.stuffData.getLegacyString() : floorType);
            wallType        = ((furnitureItem.category === FurniCategory._Str_3639) ? groupItem.stuffData.getLegacyString() : wallType);
            landscapeType   = ((furnitureItem.category === FurniCategory._Str_3432) ? groupItem.stuffData.getLegacyString() : landscapeType);

            roomPreviewer.updateObjectRoom(floorType, wallType, landscapeType);

            if(furnitureItem.category === FurniCategory._Str_3432)
            {
                // insert a window if the type is landscape
                //_local_19 = this._model.controller._Str_18225("ads_twi_windw", ProductTypeEnum.WALL);
                //this._roomPreviewer._Str_12087(_local_19.id, new Vector3d(90, 0, 0), _local_19._Str_4558);
            }
        }
        else
        {
            if(groupItem.isWallItem)
            {
                roomPreviewer.addWallItemIntoRoom(groupItem.type, new Vector3d(90), furnitureItem.stuffData.getLegacyString());
            }
            else
            {
                roomPreviewer.addFurnitureIntoRoom(groupItem.type, new Vector3d(90), groupItem.stuffData, (furnitureItem.extra.toString()));
            }
        }
    }, [ roomPreviewer, groupItem ]);

    return (
        <div className="row h-100">
            <div className="col col-7">
                <div className="row row-cols-5 g-0 item-container">
                    { groupItems && groupItems.length && groupItems.map((item, index) =>
                        {
                            return <InventoryFurnitureItemView key={ index } groupItem={ item } isActive={ groupItem === item } setGroupItem={ setGroupItem } />
                        })
                    }
                </div>
            </div>
            <div className="d-flex flex-column col col-5 justify-space-between">
                <RoomPreviewerView roomPreviewer={ roomPreviewer } height={ 130 } />
                { groupItem && <div className="flex-grow-1 py-2">
                    <p className="fs-6 text-black">{ groupItem.name }</p>
                    { !!roomSession && <button type="button" className="btn btn-success" onClick={ event => attemptItemPlacement(groupItem) }>{ LocalizeText('inventory.furni.placetoroom') }</button> }
                </div> }
            </div>
        </div>
    );
}
