import { GetBotInventoryComposer, RoomObjectVariable } from 'nitro-renderer';
import { FC, useEffect } from 'react';
import { GetRoomEngine } from '../../../../api';
import { SendMessageHook } from '../../../../hooks/messages/message-event';
import { LocalizeText } from '../../../../utils/LocalizeText';
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
        <div className="row h-100">
            <div className="col-7 d-flex flex-column h-100">
                <InventoryBotResultsView botItems={ botItems }  />
            </div>
            <div className="d-flex flex-column col-5 justify-space-between">
                <RoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                { botItem && <div className="d-flex flex-column flex-grow-1">
                    <p className="flex-grow-1 fs-6 text-black my-2">{ botItem.botData.name }</p>
                    { !!roomSession && <button type="button" className="btn btn-success btn-sm" onClick={ event => attemptBotPlacement(botItem) }>{ LocalizeText('inventory.furni.placetoroom') }</button> }
                </div> }
            </div>
        </div>
    );
}
