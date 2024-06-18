import { GetRoomEngine, IRoomSession, RoomObjectVariable, RoomPreviewer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { IBotItem, LocalizeText, UnseenItemCategory, attemptBotPlacement } from '../../../../api';
import { LayoutRoomPreviewerView } from '../../../../common';
import { useInventoryBots, useInventoryUnseenTracker } from '../../../../hooks';
import { InfiniteGrid, NitroButton } from '../../../../layout';
import { InventoryCategoryEmptyView } from '../InventoryCategoryEmptyView';
import { InventoryBotItemView } from './InventoryBotItemView';

export const InventoryBotView: FC<{
    roomSession: IRoomSession;
    roomPreviewer: RoomPreviewer;
}> = props =>
{
    const { roomSession = null, roomPreviewer = null } = props;
    const [ isVisible, setIsVisible ] = useState(false);
    const { botItems = [], selectedBot = null, activate = null, deactivate = null } = useInventoryBots();
    const { isUnseen = null, removeUnseen = null } = useInventoryUnseenTracker();

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

    useEffect(() =>
    {
        if(!selectedBot || !isUnseen(UnseenItemCategory.BOT, selectedBot.botData.id)) return;

        removeUnseen(UnseenItemCategory.BOT, selectedBot.botData.id);
    }, [ selectedBot, isUnseen, removeUnseen ]);

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

    if(!botItems || !botItems.length) return <InventoryCategoryEmptyView desc={ LocalizeText('inventory.empty.bots.desc') } title={ LocalizeText('inventory.empty.bots.title') } />;

    return (
        <div className="grid h-full grid-cols-12 gap-2">
            <div className="flex flex-col col-span-7 gap-1 overflow-hidden">
                <InfiniteGrid<IBotItem>
                    columnCount={ 6 }
                    itemRender={ item => <InventoryBotItemView botItem={ item } /> }
                    items={ botItems } />
            </div>
            <div className="flex flex-col col-span-5">
                <div className="relative flex flex-col">
                    <LayoutRoomPreviewerView height={ 140 } roomPreviewer={ roomPreviewer } />
                </div>
                { selectedBot &&
                        <div className="flex flex-col justify-between gap-2 grow">
                            <span className="truncate grow">{ selectedBot.botData.name }</span>
                            { !!roomSession &&
                                <NitroButton onClick={ event => attemptBotPlacement(selectedBot) }>
                                    { LocalizeText('inventory.furni.placetoroom') }
                                </NitroButton> }
                        </div> }
            </div>
        </div>
    );
};
