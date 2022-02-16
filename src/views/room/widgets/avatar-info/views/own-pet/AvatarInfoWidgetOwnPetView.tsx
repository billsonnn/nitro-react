import { PetType, RoomObjectCategory, RoomObjectType, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { GetOwnRoomObject, LocalizeText, RoomWidgetMessage, RoomWidgetUserActionMessage } from '../../../../../../api';
import { useRoomContext } from '../../../../context/RoomContext';
import { ContextMenuView } from '../../../context-menu/ContextMenuView';
import { ContextMenuHeaderView } from '../../../context-menu/views/header/ContextMenuHeaderView';
import { ContextMenuListItemView } from '../../../context-menu/views/list-item/ContextMenuListItemView';
import { AvatarInfoWidgetOwnPetViewProps } from './AvatarInfoWidgetOwnPetView.types';

const _Str_2906: number = 0;
const _Str_5818: number = 1;
const _Str_5938: number = 2;
const _Str_10946: number = 3;

export const AvatarInfoWidgetOwnPetView: FC<AvatarInfoWidgetOwnPetViewProps> = props =>
{
    const { petData = null, close = null } = props;
    const [ mode, setMode ] = useState(_Str_2906);
    const [ respectsLeft, setRespectsLeft ] = useState(0);
    const { roomSession = null, widgetHandler = null } = useRoomContext();

    useEffect(() =>
    {
        setMode(prevValue =>
            {
                if(petData.petType === PetType.MONSTERPLANT) return _Str_10946;
                else if(petData.saddle && !petData.rider) return _Str_5818;
                else if(petData.rider) return _Str_5938;

                return _Str_2906;
            });

        setRespectsLeft(petData.respectsPetLeft);
    }, [ petData ])

    const processAction = useCallback((name: string) =>
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
                case 'train':
                    //this.widget._Str_23877();
                    break;
                case 'pick_up':
                    messageType = RoomWidgetUserActionMessage.PICKUP_PET;
                    break;
                case 'mount':
                    messageType = RoomWidgetUserActionMessage.MOUNT_PET;
                    break;
                case 'toggle_riding_permission':
                    messageType = RoomWidgetUserActionMessage.TOGGLE_PET_RIDING_PERMISSION;
                    break;
                case 'toggle_breeding_permission':
                    messageType = RoomWidgetUserActionMessage.TOGGLE_PET_BREEDING_PERMISSION;
                    break;
                case 'dismount':
                    messageType = RoomWidgetUserActionMessage.DISMOUNT_PET;
                    break;
                case 'saddle_off':
                    messageType = RoomWidgetUserActionMessage.SADDLE_OFF;
                    break;
                case 'breed':
                    if(mode === _Str_2906)
                    {
                        // _local_7 = RoomWidgetPetCommandMessage._Str_16282;
                        // _local_8 = ("pet.command." + _local_7);
                        // _local_9 = _Str_2268.catalog.localization.getLocalization(_local_8);
                        // _local_4 = new RoomWidgetPetCommandMessage(RoomWidgetPetCommandMessage.RWPCM_PET_COMMAND, this._Str_594.id, ((this._Str_594.name + " ") + _local_9));
                    }

                    else if(mode === _Str_10946)
                    {
                        messageType = RoomWidgetUserActionMessage.REQUEST_BREED_PET;
                    }
                    break;
                case 'harvest':
                    messageType = RoomWidgetUserActionMessage.HARVEST_PET;
                    break;
                case 'revive':
                    messageType = RoomWidgetUserActionMessage.REVIVE_PET;
                    break;
                case 'compost':
                    messageType = RoomWidgetUserActionMessage.COMPOST_PLANT;
                    break;
                case 'buy_saddle':
                    //this.openCatalogPage(this._Str_11220);
                    break;
            }

            if(messageType) message = new RoomWidgetUserActionMessage(messageType, petData.id);

            if(message) widgetHandler.processWidgetMessage(message);
        }

        if(hideMenu) close();
    }, [ widgetHandler, petData, mode, close ]);

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

    return (
        <ContextMenuView objectId={ petData.roomIndex } category={ RoomObjectCategory.UNIT } userType={ RoomObjectType.PET } close={ close }>
            <ContextMenuHeaderView>
                { petData.name }
            </ContextMenuHeaderView>
            { (mode === _Str_2906) &&
                <>
                    { (respectsLeft > 0) &&
                        <ContextMenuListItemView onClick={ event => processAction('respect') }>
                            { LocalizeText('infostand.button.petrespect', [ 'count' ], [ respectsLeft.toString() ]) }
                        </ContextMenuListItemView> }
                    <ContextMenuListItemView onClick={ event => processAction('train') }>
                        { LocalizeText('infostand.button.train') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('pick_up') }>
                        { LocalizeText('infostand.button.pickup') }
                    </ContextMenuListItemView>
                    { (petData.petType === PetType.HORSE) &&
                        <ContextMenuListItemView onClick={ event => processAction('buy_saddle') }>
                            { LocalizeText('infostand.button.buy_saddle') }
                        </ContextMenuListItemView> }
                    { ([ PetType.BEAR, PetType.TERRIER, PetType.CAT, PetType.DOG, PetType.PIG ].indexOf(petData.petType) > -1) &&
                        <ContextMenuListItemView onClick={ event => processAction('breed') }>
                            { LocalizeText('infostand.button.breed') }
                        </ContextMenuListItemView> }
                </> }
            { (mode === _Str_5818) &&
                <>
                    <ContextMenuListItemView onClick={ event => processAction('mount') }>
                        { LocalizeText('infostand.button.mount') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('toggle_riding_permission') }>
                        <input type="checkbox" className="me-1" checked={ !!petData.publiclyRideable } readOnly={ true }  />
                        { LocalizeText('infostand.button.toggle_riding_permission') }
                    </ContextMenuListItemView>
                    { (respectsLeft > 0) &&
                        <ContextMenuListItemView onClick={ event => processAction('respect') }>
                            { LocalizeText('infostand.button.petrespect', [ 'count' ], [ respectsLeft.toString() ]) }
                        </ContextMenuListItemView> }
                    <ContextMenuListItemView onClick={ event => processAction('train') }>
                        { LocalizeText('infostand.button.train') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('pick_up') }>
                        { LocalizeText('infostand.button.pickup') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('saddle_off') }>
                        { LocalizeText('infostand.button.saddleoff') }
                    </ContextMenuListItemView>
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
            { (mode === _Str_10946) &&
                <>
                    <ContextMenuListItemView onClick={ event => processAction('pick_up') }>
                        { LocalizeText('infostand.button.pickup') }
                    </ContextMenuListItemView>
                    { petData.dead &&
                        <ContextMenuListItemView onClick={ event => processAction('revive') }>
                            { LocalizeText('infostand.button.revive') }
                        </ContextMenuListItemView> }
                    { roomSession.isRoomOwner &&
                        <ContextMenuListItemView onClick={ event => processAction('compost') }>
                            { LocalizeText('infostand.button.compost') }
                        </ContextMenuListItemView> }
                    { !petData.dead && ((petData.energy / petData.maximumEnergy) < 0.98) &&
                        <ContextMenuListItemView onClick={ event => processAction('treat') }>
                            { LocalizeText('infostand.button.treat') }
                        </ContextMenuListItemView> }
                    { !petData.dead && (petData.level === petData.maximumLevel) && petData.breedable &&
                        <>
                            <ContextMenuListItemView onClick={ event => processAction('toggle_breeding_permission') }>
                                <input type="checkbox" className="me-1" checked={ petData.publiclyBreedable } readOnly={ true }  />
                                { LocalizeText('infostand.button.toggle_breeding_permission') }
                            </ContextMenuListItemView>
                            <ContextMenuListItemView onClick={ event => processAction('breed') }>
                                { LocalizeText('infostand.button.breed') }
                            </ContextMenuListItemView>
                        </> }
                </> }
            { canGiveHandItem &&
                <ContextMenuListItemView onClick={ event => processAction('pass_hand_item') }>
                    { LocalizeText('infostand.button.pass_hand_item') }
                </ContextMenuListItemView> }
        </ContextMenuView>
    );
}
