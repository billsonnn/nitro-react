import { ContextMenuEnum, GroupFurniContextMenuInfoMessageEvent, GroupFurniContextMenuInfoMessageParser, RoomEngineTriggerWidgetEvent, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { GetRoomEngine, IsOwnerOfFurniture, TryJoinGroup, TryVisitRoom } from '../../../../api';
import { useMessageEvent, useRoomEngineEvent } from '../../../events';
import { useRoom } from '../../useRoom';

const MONSTERPLANT_SEED_CONFIRMATION: string = 'MONSTERPLANT_SEED_CONFIRMATION';
const PURCHASABLE_CLOTHING_CONFIRMATION: string = 'PURCHASABLE_CLOTHING_CONFIRMATION';
const GROUP_FURNITURE: string = 'GROUP_FURNITURE';
const EFFECTBOX_OPEN: string = 'EFFECTBOX_OPEN';

const useFurnitureContextMenuWidgetState = () =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ mode, setMode ] = useState<string>(null);
    const [ confirmMode, setConfirmMode ] = useState<string>(null);
    const [ confirmingObjectId, setConfirmingObjectId ] = useState(-1);
    const [ groupData, setGroupData ] = useState<GroupFurniContextMenuInfoMessageParser>(null);
    const [ isGroupMember, setIsGroupMember ] = useState(false);
    const { roomSession = null } = useRoom();

    const onClose = () =>
    {
        setObjectId(-1);
        setGroupData(null);
        setIsGroupMember(false);
        setMode(null);
    }

    const closeConfirm = () =>
    {
        setConfirmMode(null);
        setConfirmingObjectId(-1);
    }

    const processAction = (name: string) =>
    {
        if(name)
        {
            switch(name)
            {
                case 'use_friend_furni':
                    roomSession.useMultistateItem(objectId);
                    break;
                case 'use_monsterplant_seed':
                    setConfirmMode(MONSTERPLANT_SEED_CONFIRMATION);
                    setConfirmingObjectId(objectId);
                    break;
                case 'use_random_teleport':
                    GetRoomEngine().useRoomObject(objectId, RoomObjectCategory.FLOOR);
                    break;
                case 'use_purchaseable_clothing':
                    setConfirmMode(PURCHASABLE_CLOTHING_CONFIRMATION);
                    setConfirmingObjectId(objectId);
                    break;
                case 'join_group':
                    TryJoinGroup(groupData.guildId);
                    setIsGroupMember(true);
                    return;
                case 'go_to_group_homeroom':
                    if(groupData) TryVisitRoom(groupData.guildHomeRoomId);
                    break;
            }
        }

        onClose();
    }

    useRoomEngineEvent<RoomEngineTriggerWidgetEvent>([
        RoomEngineTriggerWidgetEvent.OPEN_FURNI_CONTEXT_MENU,
        RoomEngineTriggerWidgetEvent.CLOSE_FURNI_CONTEXT_MENU,
        RoomEngineTriggerWidgetEvent.REQUEST_MONSTERPLANT_SEED_PLANT_CONFIRMATION_DIALOG,
        RoomEngineTriggerWidgetEvent.REQUEST_PURCHASABLE_CLOTHING_CONFIRMATION_DIALOG,
        RoomEngineTriggerWidgetEvent.REQUEST_EFFECTBOX_OPEN_DIALOG
    ], event =>
    {
        const object = GetRoomEngine().getRoomObject(roomSession.roomId, event.objectId, event.category);

        if(!object) return;

        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_MONSTERPLANT_SEED_PLANT_CONFIRMATION_DIALOG:
                if(!IsOwnerOfFurniture(object)) return;

                setConfirmingObjectId(object.id);
                setConfirmMode(MONSTERPLANT_SEED_CONFIRMATION);

                onClose();
                return;
            case RoomEngineTriggerWidgetEvent.REQUEST_EFFECTBOX_OPEN_DIALOG:
                if(!IsOwnerOfFurniture(object)) return;

                setConfirmingObjectId(object.id);
                setConfirmMode(EFFECTBOX_OPEN);

                onClose();
                return;
            case RoomEngineTriggerWidgetEvent.REQUEST_PURCHASABLE_CLOTHING_CONFIRMATION_DIALOG:
                if(!IsOwnerOfFurniture(object)) return;

                setConfirmingObjectId(object.id);
                setConfirmMode(PURCHASABLE_CLOTHING_CONFIRMATION);

                onClose();
                return;
            case RoomEngineTriggerWidgetEvent.OPEN_FURNI_CONTEXT_MENU:

                setObjectId(object.id);

                switch(event.contextMenu)
                {
                    case ContextMenuEnum.FRIEND_FURNITURE:
                        setMode(ContextMenuEnum.FRIEND_FURNITURE);
                        return;
                    case ContextMenuEnum.MONSTERPLANT_SEED:
                        if(IsOwnerOfFurniture(object)) setMode(ContextMenuEnum.MONSTERPLANT_SEED);
                        return;
                    case ContextMenuEnum.MYSTERY_BOX:
                        return;
                    case ContextMenuEnum.RANDOM_TELEPORT:
                        setMode(ContextMenuEnum.RANDOM_TELEPORT);
                        return;
                    case ContextMenuEnum.PURCHASABLE_CLOTHING:
                        if(IsOwnerOfFurniture(object)) setMode(ContextMenuEnum.PURCHASABLE_CLOTHING);
                        return;
                }

                return;
            case RoomEngineTriggerWidgetEvent.CLOSE_FURNI_CONTEXT_MENU:
                if(object.id === objectId) onClose();
                return;
        }
    });

    useMessageEvent<GroupFurniContextMenuInfoMessageEvent>(GroupFurniContextMenuInfoMessageEvent, event =>
    {
        const parser = event.getParser();

        setObjectId(parser.objectId);
        setGroupData(parser);
        setIsGroupMember(parser.userIsMember);
        setMode(GROUP_FURNITURE);
    });

    return { objectId, mode, confirmMode, confirmingObjectId, groupData, isGroupMember, closeConfirm, processAction, onClose };
}

export const useFurnitureContextMenuWidget = useFurnitureContextMenuWidgetState;
