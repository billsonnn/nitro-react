import { GetBotInventoryComposer, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { GetRoomEngine, LocalizeText } from '../../../../api';
import { SendMessageHook } from '../../../../hooks/messages/message-event';
import { NitroLayoutFlexColumn } from '../../../../layout/flex-column/NitroLayoutFlexColumn';
import { NitroLayoutGridColumn } from '../../../../layout/grid/column/NitroLayoutGridColumn';
import { NitroLayoutGrid } from '../../../../layout/grid/NitroLayoutGrid';
import { RoomPreviewerView } from '../../../shared/room-previewer/RoomPreviewerView';
import { attemptBotPlacement } from '../../common/BotUtilities';
import { useInventoryContext } from '../../context/InventoryContext';
import { InventoryBotActions } from '../../reducers/InventoryBotReducer';
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

    if(!botItems || !botItems.length)
    {
        return (
            <div className="row h-100">
                <div className="col-5 d-flex justify-content-center align-items-center">
                    <div className="empty-image"></div>
                </div>
                <div className="d-flex flex-column col-7 justify-content-center">
                    <div className="h5 m-0 text-black fw-bold m-0 mb-2">
                        { LocalizeText('inventory.empty.bots.title') }
                    </div>
                    <div className="h6 text-black">{ LocalizeText('inventory.empty.bots.desc') }</div>
                </div>
            </div>
        );
    }

    return (
        <NitroLayoutGrid>
            <NitroLayoutGridColumn size={ 7 } gap={ 2 }>
                <InventoryBotResultsView botItems={ botItems } />
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn size={ 5 } gap={ 2 } overflow="auto">
                <NitroLayoutFlexColumn overflow="hidden" position="relative">
                    <RoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                </NitroLayoutFlexColumn>
                { botItem &&
                    <NitroLayoutFlexColumn className="flex-grow-1" gap={ 2 }>
                        <div className="flex-grow-1 text-black text-truncate">{ botItem.botData.name }</div>
                        { !!roomSession && <button type="button" className="btn btn-success btn-sm" onClick={ event => attemptBotPlacement(botItem) }>{ LocalizeText('inventory.furni.placetoroom') }</button> }
                    </NitroLayoutFlexColumn> }
            </NitroLayoutGridColumn>
        </NitroLayoutGrid>
    );
}
