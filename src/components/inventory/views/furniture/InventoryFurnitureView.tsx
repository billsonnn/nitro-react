import { FurnitureListComposer, IRoomSession, RoomObjectVariable, RoomPreviewer, Vector3d } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetRoomEngine, GetSessionDataManager, LocalizeText } from '../../../../api';
import { AutoGrid } from '../../../../common/AutoGrid';
import { Button } from '../../../../common/Button';
import { Column } from '../../../../common/Column';
import { Grid } from '../../../../common/Grid';
import { Text } from '../../../../common/Text';
import { SendMessageHook } from '../../../../hooks/messages';
import { LimitedEditionCompactPlateView } from '../../../../views/shared/limited-edition/LimitedEditionCompactPlateView';
import { RarityLevelView } from '../../../../views/shared/rarity-level/RarityLevelView';
import { RoomPreviewerView } from '../../../../views/shared/room-previewer/RoomPreviewerView';
import { FurniCategory } from '../../common/FurniCategory';
import { attemptItemPlacement, attemptPlaceMarketplaceOffer } from '../../common/FurnitureUtilities';
import { GroupItem } from '../../common/GroupItem';
import { useInventoryContext } from '../../InventoryContext';
import { InventoryFurnitureActions } from '../../reducers/InventoryFurnitureReducer';
import { InventoryCategoryEmptyView } from '../category-empty/InventoryCategoryEmptyView';
import { InventoryFurnitureItemView } from './InventoryFurnitureItemView';
import { InventoryFurnitureSearchView } from './InventoryFurnitureSearchView';

export interface InventoryFurnitureViewProps
{
    roomSession: IRoomSession;
    roomPreviewer: RoomPreviewer;
}

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

        let wallType = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_WALL_TYPE);
        let floorType = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_FLOOR_TYPE);
        let landscapeType = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_LANDSCAPE_TYPE);

        wallType = (wallType && wallType.length) ? wallType : '101';
        floorType = (floorType && floorType.length) ? floorType : '101';
        landscapeType = (landscapeType && landscapeType.length) ? landscapeType : '1.1';

        roomPreviewer.reset(false);
        roomPreviewer.updateObjectRoom(floorType, wallType, landscapeType);
        roomPreviewer.updateRoomWallsAndFloorVisibility(true, true);

        if((furnitureItem.category === FurniCategory.WALL_PAPER) || (furnitureItem.category === FurniCategory.FLOOR) || (furnitureItem.category === FurniCategory.LANDSCAPE))
        {
            floorType = ((furnitureItem.category === FurniCategory.FLOOR) ? groupItem.stuffData.getLegacyString() : floorType);
            wallType = ((furnitureItem.category === FurniCategory.WALL_PAPER) ? groupItem.stuffData.getLegacyString() : wallType);
            landscapeType = ((furnitureItem.category === FurniCategory.LANDSCAPE) ? groupItem.stuffData.getLegacyString() : landscapeType);

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
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <InventoryFurnitureSearchView groupItems={ groupItems } setGroupItems={ setFilteredGroupItems } />
                <AutoGrid columnCount={ 5 }>
                    { filteredGroupItems && (filteredGroupItems.length > 0) && filteredGroupItems.map((item, index) => <InventoryFurnitureItemView key={ index } groupItem={ item } />) }
                </AutoGrid>
            </Column>
            <Column size={ 5 } overflow="auto">
                <Column overflow="hidden" position="relative">
                    <RoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                    { groupItem && groupItem.stuffData.isUnique &&
                        <LimitedEditionCompactPlateView className="top-2 end-2" position="absolute" uniqueNumber={ groupItem.stuffData.uniqueNumber } uniqueSeries={ groupItem.stuffData.uniqueSeries } /> }
                    { (groupItem && groupItem.stuffData.rarityLevel > -1) &&
                        <RarityLevelView className="top-2 end-2" position="absolute" level={ groupItem.stuffData.rarityLevel } /> }
                </Column>
                { groupItem &&
                    <Column grow justifyContent="between" gap={ 2 }>
                        <Text grow truncate>{ groupItem.name }</Text>
                        <Column gap={ 1 }>
                            { !!roomSession &&
                                <Button variant="success" onClick={ event => attemptItemPlacement(groupItem) }>
                                    { LocalizeText('inventory.furni.placetoroom') }
                                </Button> }
                            { (groupItem && groupItem.isSellable) &&
                                <Button onClick={ event => attemptPlaceMarketplaceOffer(groupItem) }>
                                    { LocalizeText('inventory.marketplace.sell') }
                                </Button> }
                        </Column>
                    </Column> }
            </Column>
        </Grid>
    );
}
