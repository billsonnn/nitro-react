import { FurnitureListComposer, RoomObjectVariable, Vector3d } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetRoomEngine, GetSessionDataManager, LocalizeText } from '../../../../api';
import { SendMessageHook } from '../../../../hooks/messages';
import { NitroLayoutButton } from '../../../../layout';
import { NitroLayoutBase } from '../../../../layout/base';
import { NitroLayoutFlexColumn } from '../../../../layout/flex-column/NitroLayoutFlexColumn';
import { NitroLayoutGridColumn } from '../../../../layout/grid/column/NitroLayoutGridColumn';
import { NitroLayoutGrid } from '../../../../layout/grid/NitroLayoutGrid';
import { LimitedEditionCompactPlateView } from '../../../shared/limited-edition/compact-plate/LimitedEditionCompactPlateView';
import { RarityLevelView } from '../../../shared/rarity-level/RarityLevelView';
import { RoomPreviewerView } from '../../../shared/room-previewer/RoomPreviewerView';
import { FurniCategory } from '../../common/FurniCategory';
import { attemptItemPlacement, attemptPlaceMarketplaceOffer } from '../../common/FurnitureUtilities';
import { GroupItem } from '../../common/GroupItem';
import { useInventoryContext } from '../../context/InventoryContext';
import { InventoryFurnitureActions } from '../../reducers/InventoryFurnitureReducer';
import { InventoryCategoryEmptyView } from '../category-empty/InventoryCategoryEmptyView';
import { InventoryFurnitureViewProps } from './InventoryFurnitureView.types';
import { InventoryFurnitureResultsView } from './results/InventoryFurnitureResultsView';
import { InventoryFurnitureSearchView } from './search/InventoryFurnitureSearchView';

export const InventoryFurnitureView: FC<InventoryFurnitureViewProps> = props =>
{
    const { roomSession = null, roomPreviewer = null } = props;
    const { furnitureState = null, dispatchFurnitureState = null, unseenTracker = null } = useInventoryContext();
    const { needsFurniUpdate = false, groupItem = null, groupItems = [] } = furnitureState;
    const [ filteredGroupItems, setFilteredGroupItems ] = useState<GroupItem[]>(groupItems);

    useEffect(() =>
    {
        if(needsFurniUpdate)
        {
            dispatchFurnitureState({
                type: InventoryFurnitureActions.SET_NEEDS_UPDATE,
                payload: {
                    flag: false
                }
            });

            SendMessageHook(new FurnitureListComposer());
        }
        else
        {
            setFilteredGroupItems(groupItems);

            dispatchFurnitureState({
                type: InventoryFurnitureActions.SET_GROUP_ITEM,
                payload: {
                    groupItem: null
                }
            });
        }

    }, [ needsFurniUpdate, groupItems, dispatchFurnitureState ]);

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

        if((furnitureItem.category === FurniCategory.WALL_PAPER) || (furnitureItem.category === FurniCategory.FLOOR) || (furnitureItem.category === FurniCategory.LANDSCAPE))
        {
            floorType       = ((furnitureItem.category === FurniCategory.FLOOR) ? groupItem.stuffData.getLegacyString() : floorType);
            wallType        = ((furnitureItem.category === FurniCategory.WALL_PAPER) ? groupItem.stuffData.getLegacyString() : wallType);
            landscapeType   = ((furnitureItem.category === FurniCategory.LANDSCAPE) ? groupItem.stuffData.getLegacyString() : landscapeType);

            roomPreviewer.updateObjectRoom(floorType, wallType, landscapeType);

            if(furnitureItem.category === FurniCategory.LANDSCAPE)
            {
                const data = GetSessionDataManager().getWallItemDataByName('noob_window_double');

                if(data) roomPreviewer.addWallItemIntoRoom(data.id, new Vector3d(90, 0, 0), data.customParams);
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

    if(!groupItems || !groupItems.length) return <InventoryCategoryEmptyView title={ LocalizeText('inventory.empty.title') } desc={ LocalizeText('inventory.empty.desc') } />;

    return (
        <NitroLayoutGrid>
            <NitroLayoutGridColumn size={ 7 }>
                <InventoryFurnitureSearchView groupItems={ groupItems } setGroupItems={ setFilteredGroupItems } />
                <InventoryFurnitureResultsView groupItems={ filteredGroupItems }  />
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn size={ 5 } overflow="auto">
                <NitroLayoutFlexColumn overflow="hidden" position="relative">
                    <RoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                    { groupItem && groupItem.stuffData.isUnique &&
                        <NitroLayoutBase className="top-2 end-2" position="absolute">
                            <LimitedEditionCompactPlateView uniqueNumber={ groupItem.stuffData.uniqueNumber } uniqueSeries={ groupItem.stuffData.uniqueSeries } />
                        </NitroLayoutBase> }
                    { (groupItem && groupItem.stuffData.rarityLevel > -1) &&
                        <NitroLayoutBase className="top-2 end-2" position="absolute">
                            <RarityLevelView level={ groupItem.stuffData.rarityLevel } />
                        </NitroLayoutBase> }
                </NitroLayoutFlexColumn>
                { groupItem &&
                    <NitroLayoutFlexColumn className="flex-grow-1" gap={ 2 }>
                        <NitroLayoutBase className="flex-grow-1 text-black text-truncate">{ groupItem.name }</NitroLayoutBase>
                        { roomSession &&
                            <NitroLayoutButton variant="success" size="sm" onClick={ event => attemptItemPlacement(groupItem) }>
                                { LocalizeText('inventory.furni.placetoroom') }
                            </NitroLayoutButton> }
                        { (groupItem && groupItem.isSellable) &&
                            <NitroLayoutButton variant="primary" size="sm" onClick={ event => attemptPlaceMarketplaceOffer(groupItem) }>
                                { LocalizeText('inventory.marketplace.sell') }
                            </NitroLayoutButton>
                        }
                    </NitroLayoutFlexColumn> }
            </NitroLayoutGridColumn>
        </NitroLayoutGrid>
    );
}
