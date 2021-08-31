import { ContextMenuEnum, GroupFurniContextMenuInfoMessageParser, RoomEngineTriggerWidgetEvent, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { GroupFurniContextMenuInfoMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/furniture/GroupFurniContextMenuInfoMessageEvent';
import { FC, useCallback, useState } from 'react';
import { GetRoomEngine, IsOwnerOfFurniture, LocalizeText, RoomWidgetFurniActionMessage, TryVisitRoom } from '../../../../../api';
import { TryJoinGroup } from '../../../../../api/groups/TryJoinGroup';
import { CreateMessageHook } from '../../../../../hooks';
import { useRoomEngineEvent } from '../../../../../hooks/events';
import { useRoomContext } from '../../../context/RoomContext';
import { ContextMenuView } from '../../context-menu/ContextMenuView';
import { ContextMenuHeaderView } from '../../context-menu/views/header/ContextMenuHeaderView';
import { ContextMenuListItemView } from '../../context-menu/views/list-item/ContextMenuListItemView';
import { MonsterPlantSeedConfirmView } from './views/monsterplant-seed/MonsterPlantSeedConfirmView';
import { PurchasableClothingConfirmView } from './views/purchaseable-clothing/PurchasableClothingConfirmView';

const MONSTERPLANT_SEED_CONFIRMATION: string = 'MONSTERPLANT_SEED_CONFIRMATION';
const PURCHASABLE_CLOTHING_CONFIRMATION: string = 'PURCHASABLE_CLOTHING_CONFIRMATION';
const GROUP_FURNITURE: string = 'GROUP_FURNITURE';

export const FurnitureContextMenuView: FC<{}> = props =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ mode, setMode ] = useState<string>(null);
    const [ confirmMode, setConfirmMode ] = useState<string>(null);
    const [ confirmingObjectId, setConfirmingObjectId ] = useState(-1);
    const [ groupData, setGroupData ] = useState<GroupFurniContextMenuInfoMessageParser>(null);
    const [ isGroupMember, setIsGroupMember ] = useState(false);

    const { roomSession = null, widgetHandler = null } = useRoomContext();

    const close = useCallback(() =>
    {
        setObjectId(-1);
        setGroupData(null);
        setIsGroupMember(false);
        setMode(null);
    }, []);

    const closeConfirm = useCallback(() =>
    {
        setConfirmMode(null);
        setConfirmingObjectId(-1);
    }, []);

    const onRoomEngineTriggerWidgetEvent = useCallback((event: RoomEngineTriggerWidgetEvent) =>
    {
        const object = GetRoomEngine().getRoomObject(roomSession.roomId, event.objectId, event.category);

        if(!object) return;

        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_MONSTERPLANT_SEED_PLANT_CONFIRMATION_DIALOG:
                setConfirmingObjectId(object.id);
                setConfirmMode(MONSTERPLANT_SEED_CONFIRMATION);

                close();
                return;
            case RoomEngineTriggerWidgetEvent.REQUEST_PURCHASABLE_CLOTHING_CONFIRMATION_DIALOG:
                setConfirmingObjectId(object.id);
                setConfirmMode(PURCHASABLE_CLOTHING_CONFIRMATION);

                close();
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
                if(object.id === objectId) close();
                return;
        }
    }, [ roomSession, objectId, close ]);

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.OPEN_FURNI_CONTEXT_MENU, onRoomEngineTriggerWidgetEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.CLOSE_FURNI_CONTEXT_MENU, onRoomEngineTriggerWidgetEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_MONSTERPLANT_SEED_PLANT_CONFIRMATION_DIALOG, onRoomEngineTriggerWidgetEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_PURCHASABLE_CLOTHING_CONFIRMATION_DIALOG, onRoomEngineTriggerWidgetEvent);

    const onGroupFurniContextMenuInfoMessageEvent = useCallback((event: GroupFurniContextMenuInfoMessageEvent) =>
    {
        const parser = event.getParser();

        setObjectId(parser.objectId);
        setGroupData(parser);
        setIsGroupMember(parser.userIsMember);
        setMode(GROUP_FURNITURE);
    }, []);

    CreateMessageHook(GroupFurniContextMenuInfoMessageEvent, onGroupFurniContextMenuInfoMessageEvent);

    const processAction = useCallback((name: string) =>
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
                    widgetHandler.processWidgetMessage(new RoomWidgetFurniActionMessage(RoomWidgetFurniActionMessage.USE, objectId, RoomObjectCategory.FLOOR));
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

        close();
    }, [ roomSession, widgetHandler, objectId, groupData, close ]);

    return (
        <>
            { (confirmMode === MONSTERPLANT_SEED_CONFIRMATION) && <MonsterPlantSeedConfirmView objectId={ confirmingObjectId } close={ closeConfirm } /> }
            { (confirmMode === PURCHASABLE_CLOTHING_CONFIRMATION) && <PurchasableClothingConfirmView objectId={ confirmingObjectId } close={ closeConfirm } /> }
            { (objectId >= 0) && mode &&
                <ContextMenuView objectId={ objectId } category={ RoomObjectCategory.FLOOR } close={ close } fades={ true }>
                    { (mode === ContextMenuEnum.FRIEND_FURNITURE) &&
                        <>
                            <ContextMenuHeaderView>
                                { LocalizeText('friendfurni.context.title') }
                            </ContextMenuHeaderView>
                            <ContextMenuListItemView onClick={ event => processAction('use_friend_furni') }>
                                { LocalizeText('friendfurni.context.use') }
                            </ContextMenuListItemView>
                        </> }
                    { (mode === ContextMenuEnum.MONSTERPLANT_SEED) &&
                        <>
                            <ContextMenuHeaderView>
                                { LocalizeText('furni.mnstr_seed.name') }
                            </ContextMenuHeaderView>
                            <ContextMenuListItemView onClick={ event => processAction('use_monsterplant_seed') }>
                                { LocalizeText('widget.monsterplant_seed.button.use') }
                            </ContextMenuListItemView>
                        </> }
                    { (mode === ContextMenuEnum.RANDOM_TELEPORT) &&
                        <>
                            <ContextMenuHeaderView>
                                { LocalizeText('furni.random_teleport.name') }
                            </ContextMenuHeaderView>
                            <ContextMenuListItemView onClick={ event => processAction('use_random_teleport') }>
                                { LocalizeText('widget.random_teleport.button.use') }
                            </ContextMenuListItemView>
                        </> }
                    { (mode === ContextMenuEnum.PURCHASABLE_CLOTHING) &&
                        <>
                            <ContextMenuHeaderView>
                                { LocalizeText('furni.generic_usable.name') }
                            </ContextMenuHeaderView>
                            <ContextMenuListItemView onClick={ event => processAction('use_purchaseable_clothing') }>
                                { LocalizeText('widget.generic_usable.button.use') }
                            </ContextMenuListItemView>
                        </> }
                    { (mode === GROUP_FURNITURE) && groupData &&
                        <>
                            <ContextMenuHeaderView>
                                { groupData.guildName }
                            </ContextMenuHeaderView>
                            { !isGroupMember && <ContextMenuListItemView onClick={ event => processAction('join_group') }>
                                { LocalizeText('widget.furniture.button.join.group') }
                            </ContextMenuListItemView> }
                            <ContextMenuListItemView onClick={ event => processAction('go_to_group_homeroom') }>
                                { LocalizeText('widget.furniture.button.go.to.group.home.room') }
                            </ContextMenuListItemView>
                        </> }
                </ContextMenuView> }
        </>
    )
}
