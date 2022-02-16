import { GetBotInventoryComposer, IRoomSession, RoomObjectVariable, RoomPreviewer } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { GetRoomEngine, LocalizeText } from '../../../../api';
import { AutoGrid } from '../../../../common/AutoGrid';
import { Button } from '../../../../common/Button';
import { Column } from '../../../../common/Column';
import { Grid } from '../../../../common/Grid';
import { Text } from '../../../../common/Text';
import { SendMessageHook } from '../../../../hooks/messages/message-event';
import { RoomPreviewerView } from '../../../../views/shared/room-previewer/RoomPreviewerView';
import { attemptBotPlacement } from '../../common/BotUtilities';
import { useInventoryContext } from '../../InventoryContext';
import { InventoryBotActions } from '../../reducers/InventoryBotReducer';
import { InventoryCategoryEmptyView } from '../category-empty/InventoryCategoryEmptyView';
import { InventoryBotItemView } from './InventoryBotItemView';

export interface InventoryBotViewProps
{
    roomSession: IRoomSession;
    roomPreviewer: RoomPreviewer;
}

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
    }, [ roomPreviewer, botItem ]);

    if(!botItems || !botItems.length) return <InventoryCategoryEmptyView title={ LocalizeText('inventory.empty.bots.title') } desc={ LocalizeText('inventory.empty.bots.desc') } />;

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <AutoGrid columnCount={ 5 }>
                    { botItems && (botItems.length > 0) && botItems.map(item => <InventoryBotItemView key={ item.id } botItem={ item } />) }
                </AutoGrid>
            </Column>
            <Column size={ 5 } overflow="auto">
                <Column overflow="hidden" position="relative">
                    <RoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                </Column>
                { botItem &&
                    <Column grow justifyContent="between" gap={ 2 }>
                        <Text grow truncate>{ botItem.botData.name }</Text>
                        { !!roomSession &&
                            <Button variant="success" onClick={ event => attemptBotPlacement(botItem) }>
                                { LocalizeText('inventory.furni.placetoroom') }
                            </Button> }
                    </Column> }
            </Column>
        </Grid>
    );
}
