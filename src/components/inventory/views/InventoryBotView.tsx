import { IRoomSession, MouseEventType, RoomObjectVariable, RoomPreviewer } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useEffect, useState } from 'react';
import { attemptBotPlacement, GetRoomEngine, IBotItem, LocalizeText, UnseenItemCategory } from '../../../api';
import { AutoGrid, Button, Column, Grid, LayoutAvatarImageView, LayoutGridItem, LayoutRoomPreviewerView, Text } from '../../../common';
import { useSharedInventoryBots, useSharedInventoryUnseenTracker } from '../../../hooks';
import { InventoryCategoryEmptyView } from './InventoryCategoryEmptyView';

interface InventoryBotViewProps
{
    roomSession: IRoomSession;
    roomPreviewer: RoomPreviewer;
}

export const InventoryBotView: FC<InventoryBotViewProps> = props =>
{
    const { roomSession = null, roomPreviewer = null } = props;
    const { botItems = [], selectedBot = null, selectBot = null } = useSharedInventoryBots();
    const { getCount = null, resetCategory = null, isUnseen = null, removeUnseen = null } = useSharedInventoryUnseenTracker();

    useEffect(() =>
    {
        if(!botItems || !botItems.length) return;
        
        return () =>
        {
            const count = getCount(UnseenItemCategory.BOT);

            if(!count) return;

            resetCategory(UnseenItemCategory.BOT);
        }
    }, [ botItems, getCount, resetCategory ]);

    useEffect(() =>
    {
        if(!selectedBot || !roomPreviewer) return;

        const botData = selectedBot.botData;

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
        roomPreviewer.addAvatarIntoRoom(botData.figure, 0);
    }, [ roomPreviewer, selectedBot ]);

    if(!botItems || !botItems.length) return <InventoryCategoryEmptyView title={ LocalizeText('inventory.empty.bots.title') } desc={ LocalizeText('inventory.empty.bots.desc') } />;

    const InventoryBotItemView: FC<{ botItem: IBotItem }> = props =>
    {
        const { botItem = null } = props;
        const [ isMouseDown, setMouseDown ] = useState(false);
        const isActive = (botItem === selectedBot);
        const unseen = isUnseen(UnseenItemCategory.BOT, botItem.botData.id);

        const onMouseEvent = (event: MouseEvent) =>
        {
            switch(event.type)
            {
                case MouseEventType.MOUSE_DOWN:
                    selectBot(botItem);

                    if(unseen) removeUnseen(UnseenItemCategory.BOT, botItem.botData.id);

                    setMouseDown(true);
                    return;
                case MouseEventType.MOUSE_UP:
                    setMouseDown(false);
                    return;
                case MouseEventType.ROLL_OUT:
                    if(!isMouseDown || !isActive) return;

                    attemptBotPlacement(botItem);
                    return;
            }
        }

        return (
            <LayoutGridItem itemActive={ isActive } itemUnseen={ unseen } onMouseDown={ onMouseEvent } onMouseUp={ onMouseEvent } onMouseOut={ onMouseEvent }>
                <LayoutAvatarImageView figure={ botItem.botData.figure } direction={ 3 } headOnly={ true } />
            </LayoutGridItem>
        );
    }

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <AutoGrid columnCount={ 5 }>
                    { botItems && (botItems.length > 0) && botItems.map(item => <InventoryBotItemView key={ item.botData.id } botItem={ item } />) }
                </AutoGrid>
            </Column>
            <Column size={ 5 } overflow="auto">
                <Column overflow="hidden" position="relative">
                    <LayoutRoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                </Column>
                { selectedBot &&
                    <Column grow justifyContent="between" gap={ 2 }>
                        <Text grow truncate>{ selectedBot.botData.name }</Text>
                        { !!roomSession &&
                            <Button variant="success" onClick={ event => attemptBotPlacement(selectedBot) }>
                                { LocalizeText('inventory.furni.placetoroom') }
                            </Button> }
                    </Column> }
            </Column>
        </Grid>
    );
}
