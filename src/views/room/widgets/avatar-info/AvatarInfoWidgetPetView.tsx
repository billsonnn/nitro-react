import { PetType, RoomControllerLevel, RoomObjectCategory, RoomObjectType, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { GetOwnRoomObject, GetSessionDataManager, LocalizeText, RoomWidgetMessage, RoomWidgetUpdateInfostandPetEvent, RoomWidgetUserActionMessage } from '../../../../api';
import { BatchUpdates } from '../../../../hooks';
import { useRoomContext } from '../../context/RoomContext';
import { ContextMenuHeaderView } from '../context-menu/ContextMenuHeaderView';
import { ContextMenuListItemView } from '../context-menu/ContextMenuListItemView';
import { ContextMenuView } from '../context-menu/ContextMenuView';

interface AvatarInfoWidgetPetViewProps
{
    petData: RoomWidgetUpdateInfostandPetEvent;
    close: () => void;
}

const _Str_2906: number = 0;
const _Str_5818: number = 1;
const _Str_5938: number = 2;
const _Str_13388: number = 3;

export const AvatarInfoWidgetPetView: FC<AvatarInfoWidgetPetViewProps> = props =>
{
    const { petData = null, close = null } = props;
    const [ mode, setMode ] = useState(_Str_2906);
    const [ respectsLeft, setRespectsLeft ] = useState(0);
    const { roomSession = null, widgetHandler = null } = useRoomContext();

    const canPickUp = useMemo(() =>
    {
        return (roomSession.isRoomOwner || (roomSession.controllerLevel >= RoomControllerLevel.GUEST) || GetSessionDataManager().isModerator);
    }, [ roomSession ]);

    const canGiveHandItem = useMemo(() =>
    {
        let flag = false;

        const roomObject = GetOwnRoomObject();

        if(roomObject)
        {
            const carryId = roomObject.model.getValue<number>(RoomObjectVariable.FIGURE_CARRY_OBJECT);

            if((carryId > 0) && (carryId < 999999)) flag = true;
        }

        return flag;
    }, []);

    const processAction = (name: string) =>
    {
        let messageType: string = null;
        let message: RoomWidgetMessage = null;
        let hideMenu = true;

        if(name)
        {
            switch(name)
            {
                case 'respect':
                    let newRespectsLeft = 0;

                    setRespectsLeft(prevValue =>
                    {
                        newRespectsLeft = (prevValue - 1);

                        return newRespectsLeft;
                    });

                    messageType = RoomWidgetUserActionMessage.RESPECT_PET;

                    if(newRespectsLeft > 0) hideMenu = false;
                    break;
                case 'treat':
                    messageType = RoomWidgetUserActionMessage.TREAT_PET;
                    break;
                case 'pass_handitem':
                    messageType = RoomWidgetUserActionMessage.GIVE_CARRY_ITEM_TO_PET;
                    break;
                case 'pick_up':
                    messageType = RoomWidgetUserActionMessage.PICKUP_PET;
                    break;
                case 'mount':
                    messageType = RoomWidgetUserActionMessage.MOUNT_PET;
                    break;
                case 'dismount':
                    messageType = RoomWidgetUserActionMessage.DISMOUNT_PET;
                    break;
            }

            if(messageType) message = new RoomWidgetUserActionMessage(messageType, petData.id);

            if(message) widgetHandler.processWidgetMessage(message);
        }

        if(hideMenu) close();
    }

    useEffect(() =>
    {
        BatchUpdates(() =>
        {
            setMode(prevValue =>
                {
                    if(petData.petType === PetType.MONSTERPLANT) return _Str_13388;
                    else if(petData.saddle && !petData.rider) return _Str_5818;
                    else if(petData.rider) return _Str_5938;
    
                    return _Str_2906;
                });
    
            setRespectsLeft(petData.respectsPetLeft);
        });
    }, [ petData ]);

    return (
        <ContextMenuView objectId={ petData.roomIndex } category={ RoomObjectCategory.UNIT } userType={ RoomObjectType.PET } close={ close }>
            <ContextMenuHeaderView>
                { petData.name }
            </ContextMenuHeaderView>
            { (mode === _Str_2906) && (respectsLeft > 0) &&
                <ContextMenuListItemView onClick={ event => processAction('respect') }>
                    { LocalizeText('infostand.button.petrespect', [ 'count' ], [ respectsLeft.toString() ]) }
                </ContextMenuListItemView> }
            { (mode === _Str_5818) &&
                <>
                    { !!petData.publiclyRideable &&
                        <ContextMenuListItemView onClick={ event => processAction('mount') }>
                            { LocalizeText('infostand.button.mount') }
                        </ContextMenuListItemView> }
                    { (respectsLeft > 0) &&
                        <ContextMenuListItemView onClick={ event => processAction('respect') }>
                            { LocalizeText('infostand.button.petrespect', [ 'count' ], [ respectsLeft.toString() ]) }
                        </ContextMenuListItemView> }
                </> }
            { (mode === _Str_5938) &&
                <>
                    <ContextMenuListItemView onClick={ event => processAction('dismount') }>
                        { LocalizeText('infostand.button.dismount') }
                    </ContextMenuListItemView>
                    { (respectsLeft > 0) &&
                        <ContextMenuListItemView onClick={ event => processAction('respect') }>
                            { LocalizeText('infostand.button.petrespect', [ 'count' ], [ respectsLeft.toString() ]) }
                        </ContextMenuListItemView> }
                </> }
            { (mode === _Str_13388) && !petData.dead && ((petData.energy / petData.maximumEnergy) < 0.98) &&
                <ContextMenuListItemView onClick={ event => processAction('treat') }>
                    { LocalizeText('infostand.button.treat') }
                </ContextMenuListItemView> }
            { canPickUp &&
                <ContextMenuListItemView onClick={ event => processAction('pick_up') }>
                    { LocalizeText('infostand.button.pickup') }
                </ContextMenuListItemView> }
            { canGiveHandItem &&
                <ContextMenuListItemView onClick={ event => processAction('pass_hand_item') }>
                    { LocalizeText('infostand.button.pass_hand_item') }
                </ContextMenuListItemView> }
        </ContextMenuView>
    );
}
