import { GetBotInventoryComposer, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { GetRoomEngine, LocalizeText } from '../../../../api';
import { SendMessageHook } from '../../../../hooks/messages/message-event';
import { NitroLayoutButton } from '../../../../layout';
import { NitroLayoutBase } from '../../../../layout/base';
import { NitroLayoutFlexColumn } from '../../../../layout/flex-column/NitroLayoutFlexColumn';
import { NitroLayoutGridColumn } from '../../../../layout/grid/column/NitroLayoutGridColumn';
import { NitroLayoutGrid } from '../../../../layout/grid/NitroLayoutGrid';
import { RoomPreviewerView } from '../../../shared/room-previewer/RoomPreviewerView';
import { attemptBotPlacement } from '../../common/BotUtilities';
import { useInventoryContext } from '../../context/InventoryContext';
import { InventoryBotActions } from '../../reducers/InventoryBotReducer';
import { InventoryCategoryEmptyView } from '../category-empty/InventoryCategoryEmptyView';
import { InventoryBotViewProps } from './InventoryBotView.types';
import { InventoryBotResultsView } from './results/InventoryBotResultsView';

export const InventoryBotView: FC<InventoryBotViewProps> = props =>
{
    const { roomSession = null, roomPreviewer = null } = props;
    const { botState = null, dispatchBotState = null } = useInventoryContext();
    const { needsBotUpdate = false, botItem = null, botItems = [] } = botState;

    useEffect(() =>
    {
        if(needsBotUpdate)
        {
            dispatchBotState({
                type: InventoryBotActions.SET_NEEDS_UPDATE,
                payload: {
                    flag: false
                }
            });
            
            SendMessageHook(new GetBotInventoryComposer());
        }
        else
        {
            dispatchBotState({
                type: InventoryBotActions.SET_BOT_ITEM,
                payload: {
                    botItem: null
                }
            });
        }

    }, [ needsBotUpdate, botItems, dispatchBotState ]);

    useEffect(() =>
    {
        if(!botItem || !roomPreviewer) return;

        const botData = botItem.botData;

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
        roomPreviewer.addAvatarIntoRoom(botData.figure, 0);
    }, [ roomPreviewer, botItem ]);

    if(!botItems || !botItems.length) return <InventoryCategoryEmptyView title={ LocalizeText('inventory.empty.bots.title') } desc={ LocalizeText('inventory.empty.bots.desc') } />;

    return (
        <NitroLayoutGrid>
            <NitroLayoutGridColumn size={ 7 }>
                <InventoryBotResultsView botItems={ botItems } />
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn size={ 5 } overflow="auto">
                <NitroLayoutFlexColumn overflow="hidden" position="relative">
                    <RoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                </NitroLayoutFlexColumn>
                { botItem &&
                    <NitroLayoutFlexColumn className="flex-grow-1" gap={ 2 }>
                        <NitroLayoutBase className="flex-grow-1 text-black text-truncate">{ botItem.botData.name }</NitroLayoutBase>
                        { !!roomSession &&
                            <NitroLayoutButton variant="success" size="sm" onClick={ event => attemptBotPlacement(botItem) }>
                                { LocalizeText('inventory.furni.placetoroom') }
                            </NitroLayoutButton> }
                    </NitroLayoutFlexColumn> }
            </NitroLayoutGridColumn>
        </NitroLayoutGrid>
    );
}
