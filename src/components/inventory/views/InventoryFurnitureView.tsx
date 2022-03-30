import { IRoomSession, MouseEventType, RoomObjectVariable, RoomPreviewer, Vector3d } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useEffect, useState } from 'react';
import { attemptItemPlacement, FurniCategory, GetRoomEngine, GetSessionDataManager, GroupItem, LocalizeText, UnseenItemCategory } from '../../../api';
import { AutoGrid, Button, Column, Grid, LayoutGridItem, LayoutLimitedEditionCompactPlateView, LayoutRarityLevelView, LayoutRoomPreviewerView, Text } from '../../../common';
import { useInventoryFurni, useInventoryUnseenTracker } from '../../../hooks';
import { attemptPlaceMarketplaceOffer } from '../../../hooks/inventory/common';
import { InventoryCategoryEmptyView } from './InventoryCategoryEmptyView';
import { InventoryFurnitureSearchView } from './InventoryFurnitureSearchView';

interface InventoryFurnitureViewProps
{
    roomSession: IRoomSession;
    roomPreviewer: RoomPreviewer;
}

export const InventoryFurnitureView: FC<InventoryFurnitureViewProps> = props =>
{
    const { roomSession = null, roomPreviewer = null } = props;
    const { groupItems = [], selectedItem = null, selectItem = null } = useInventoryFurni();
    const [ filteredGroupItems, setFilteredGroupItems ] = useState<GroupItem[]>(groupItems);
    const { getCount = null, resetCategory = null } = useInventoryUnseenTracker();

    useEffect(() =>
    {
        if(!selectedItem || !roomPreviewer) return;

        const furnitureItem = selectedItem.getLastItem();

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
            floorType = ((furnitureItem.category === FurniCategory.FLOOR) ? selectedItem.stuffData.getLegacyString() : floorType);
            wallType = ((furnitureItem.category === FurniCategory.WALL_PAPER) ? selectedItem.stuffData.getLegacyString() : wallType);
            landscapeType = ((furnitureItem.category === FurniCategory.LANDSCAPE) ? selectedItem.stuffData.getLegacyString() : landscapeType);

            roomPreviewer.updateObjectRoom(floorType, wallType, landscapeType);

            if(furnitureItem.category === FurniCategory.LANDSCAPE)
            {
                const data = GetSessionDataManager().getWallItemDataByName('noob_window_double');

                if(data) roomPreviewer.addWallItemIntoRoom(data.id, new Vector3d(90, 0, 0), data.customParams);
            }
        }
        else
        {
            if(selectedItem.isWallItem)
            {
                roomPreviewer.addWallItemIntoRoom(selectedItem.type, new Vector3d(90), furnitureItem.stuffData.getLegacyString());
            }
            else
            {
                roomPreviewer.addFurnitureIntoRoom(selectedItem.type, new Vector3d(90), selectedItem.stuffData, (furnitureItem.extra.toString()));
            }
        }
    }, [ roomPreviewer, selectedItem ]);

    useEffect(() =>
    {
        if(!groupItems || !groupItems.length) return;
        
        return () =>
        {
            const count = getCount(UnseenItemCategory.FURNI);

            if(!count) return;

            resetCategory(UnseenItemCategory.FURNI);

            for(const groupItem of groupItems) groupItem.hasUnseenItems = false;
        }
    }, [ groupItems, getCount, resetCategory ]);

    if(!groupItems || !groupItems.length) return <InventoryCategoryEmptyView title={ LocalizeText('inventory.empty.title') } desc={ LocalizeText('inventory.empty.desc') } />;

    const InventoryFurnitureItemView: FC<{ groupItem: GroupItem }> = props =>
    {
        const { groupItem = null } = props;
        const [ isMouseDown, setMouseDown ] = useState(false);
        const isActive = (groupItem === selectedItem);

        const onMouseEvent = (event: MouseEvent) =>
        {
            switch(event.type)
            {
                case MouseEventType.MOUSE_DOWN:
                    selectItem(groupItem);
                    setMouseDown(true);
                    return;
                case MouseEventType.MOUSE_UP:
                    setMouseDown(false);
                    return;
                case MouseEventType.ROLL_OUT:
                    if(!isMouseDown || !isActive) return;

                    attemptItemPlacement(groupItem);
                    return;
            }
        }

        useEffect(() =>
        {
            if(!isActive) return;

            groupItem.hasUnseenItems = false;
        }, [ isActive, groupItem ]);

        const count = groupItem.getUnlockedCount();

        return <LayoutGridItem className={ !count ? 'opacity-0-5 ' : '' } itemImage={ groupItem.iconUrl } itemCount={ count } itemActive={ isActive } itemUniqueNumber={ groupItem.stuffData.uniqueNumber } itemUnseen={ groupItem.hasUnseenItems } onMouseDown={ onMouseEvent } onMouseUp={ onMouseEvent } onMouseOut={ onMouseEvent } />;
    }

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
                    <LayoutRoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                    { selectedItem && selectedItem.stuffData.isUnique &&
                        <LayoutLimitedEditionCompactPlateView className="top-2 end-2" position="absolute" uniqueNumber={ selectedItem.stuffData.uniqueNumber } uniqueSeries={ selectedItem.stuffData.uniqueSeries } /> }
                    { (selectedItem && selectedItem.stuffData.rarityLevel > -1) &&
                        <LayoutRarityLevelView className="top-2 end-2" position="absolute" level={ selectedItem.stuffData.rarityLevel } /> }
                </Column>
                { selectedItem &&
                    <Column grow justifyContent="between" gap={ 2 }>
                        <Text grow truncate>{ selectedItem.name }</Text>
                        <Column gap={ 1 }>
                            { !!roomSession &&
                                <Button variant="success" onClick={ event => attemptItemPlacement(selectedItem) }>
                                    { LocalizeText('inventory.furni.placetoroom') }
                                </Button> }
                            { (selectedItem && selectedItem.isSellable) &&
                                <Button onClick={ event => attemptPlaceMarketplaceOffer(selectedItem) }>
                                    { LocalizeText('inventory.marketplace.sell') }
                                </Button> }
                        </Column>
                    </Column> }
            </Column>
        </Grid>
    );
}
