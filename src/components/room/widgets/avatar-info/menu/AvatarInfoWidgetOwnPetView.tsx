import { CreateLinkEvent, PetRespectComposer, PetType, RoomObjectCategory, RoomObjectType, RoomObjectVariable, RoomUnitGiveHandItemPetComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { AvatarInfoPet, GetConfigurationValue, GetOwnRoomObject, LocalizeText, SendMessageComposer } from '../../../../../api';
import { useRoom, useSessionInfo } from '../../../../../hooks';
import { ContextMenuHeaderView } from '../../context-menu/ContextMenuHeaderView';
import { ContextMenuListItemView } from '../../context-menu/ContextMenuListItemView';
import { ContextMenuView } from '../../context-menu/ContextMenuView';

interface AvatarInfoWidgetOwnPetViewProps
{
    avatarInfo: AvatarInfoPet;
    onClose: () => void;
}

const MODE_NORMAL: number = 0;
const MODE_SADDLED_UP: number = 1;
const MODE_RIDING: number = 2;
const MODE_MONSTER_PLANT: number = 3;

export const AvatarInfoWidgetOwnPetView: FC<AvatarInfoWidgetOwnPetViewProps> = props =>
{
    const { avatarInfo = null, onClose = null } = props;
    const [ mode, setMode ] = useState(MODE_NORMAL);
    const { roomSession = null } = useRoom();
    const { petRespectRemaining = 0, respectPet = null } = useSessionInfo();

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
        let hideMenu = true;

        if(name)
        {
            switch(name)
            {
                case 'respect':
                    respectPet(avatarInfo.id);

                    if((petRespectRemaining - 1) >= 1) hideMenu = false;
                    break;
                case 'treat':
                    SendMessageComposer(new PetRespectComposer(avatarInfo.id));
                    break;
                case 'pass_handitem':
                    SendMessageComposer(new RoomUnitGiveHandItemPetComposer(avatarInfo.id));
                    break;
                case 'train':
                    roomSession.requestPetCommands(avatarInfo.id);
                    break;
                case 'pick_up':
                    roomSession.pickupPet(avatarInfo.id);
                    break;
                case 'mount':
                    roomSession.mountPet(avatarInfo.id);
                    break;
                case 'toggle_riding_permission':
                    roomSession.togglePetRiding(avatarInfo.id);
                    break;
                case 'toggle_breeding_permission':
                    roomSession.togglePetBreeding(avatarInfo.id);
                    break;
                case 'dismount':
                    roomSession.dismountPet(avatarInfo.id);
                    break;
                case 'saddle_off':
                    roomSession.removePetSaddle(avatarInfo.id);
                    break;
                case 'breed':
                    if(mode === MODE_NORMAL)
                    {
                    // _local_7 = RoomWidgetPetCommandMessage._Str_16282;
                    // _local_8 = ("pet.command." + _local_7);
                    // _local_9 = _Str_2268.catalog.localization.getLocalization(_local_8);
                    // _local_4 = new RoomWidgetPetCommandMessage(RoomWidgetPetCommandMessage.RWPCM_PET_COMMAND, this._Str_594.id, ((this._Str_594.name + " ") + _local_9));
                    }

                    else if(mode === MODE_MONSTER_PLANT)
                    {
                        // messageType = RoomWidgetUserActionMessage.REQUEST_BREED_PET;
                    }
                    break;
                case 'harvest':
                    roomSession.harvestPet(avatarInfo.id);
                    break;
                case 'revive':
                    //
                    break;
                case 'compost':
                    roomSession.compostPlant(avatarInfo.id);
                    break;
                case 'buy_saddle':
                    CreateLinkEvent('catalog/open/' + GetConfigurationValue('catalog.links')['pets.buy_saddle']);
                    break;
            }
        }

        if(hideMenu) onClose();
    };

    useEffect(() =>
    {
        setMode(prevValue =>
        {
            if(avatarInfo.petType === PetType.MONSTERPLANT) return MODE_MONSTER_PLANT;
            else if(avatarInfo.saddle && !avatarInfo.rider) return MODE_SADDLED_UP;
            else if(avatarInfo.rider) return MODE_RIDING;

            return MODE_NORMAL;
        });
    }, [ avatarInfo ]);

    return (
        <ContextMenuView category={ RoomObjectCategory.UNIT } collapsable={ true } objectId={ avatarInfo.roomIndex } userType={ RoomObjectType.PET } onClose={ onClose }>
            <ContextMenuHeaderView>
                { avatarInfo.name }
            </ContextMenuHeaderView>
            { (mode === MODE_NORMAL) &&
                <>
                    { (petRespectRemaining > 0) &&
                        <ContextMenuListItemView onClick={ event => processAction('respect') }>
                            { LocalizeText('infostand.button.petrespect', [ 'count' ], [ petRespectRemaining.toString() ]) }
                        </ContextMenuListItemView> }
                    <ContextMenuListItemView onClick={ event => processAction('train') }>
                        { LocalizeText('infostand.button.train') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('pick_up') }>
                        { LocalizeText('infostand.button.pickup') }
                    </ContextMenuListItemView>
                    { (avatarInfo.petType === PetType.HORSE) &&
                        <ContextMenuListItemView onClick={ event => processAction('buy_saddle') }>
                            { LocalizeText('infostand.button.buy_saddle') }
                        </ContextMenuListItemView> }
                    { ([ PetType.BEAR, PetType.TERRIER, PetType.CAT, PetType.DOG, PetType.PIG ].indexOf(avatarInfo.petType) > -1) &&
                        <ContextMenuListItemView onClick={ event => processAction('breed') }>
                            { LocalizeText('infostand.button.breed') }
                        </ContextMenuListItemView> }
                </> }
            { (mode === MODE_SADDLED_UP) &&
                <>
                    <ContextMenuListItemView onClick={ event => processAction('mount') }>
                        { LocalizeText('infostand.button.mount') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView gap={ 1 } onClick={ event => processAction('toggle_riding_permission') }>
                        <input checked={ !!avatarInfo.publiclyRideable } readOnly={ true } type="checkbox" />
                        { LocalizeText('infostand.button.toggle_riding_permission') }
                    </ContextMenuListItemView>
                    { (petRespectRemaining > 0) &&
                        <ContextMenuListItemView onClick={ event => processAction('respect') }>
                            { LocalizeText('infostand.button.petrespect', [ 'count' ], [ petRespectRemaining.toString() ]) }
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
            { (mode === MODE_RIDING) &&
                <>
                    <ContextMenuListItemView onClick={ event => processAction('dismount') }>
                        { LocalizeText('infostand.button.dismount') }
                    </ContextMenuListItemView>
                    { (petRespectRemaining > 0) &&
                        <ContextMenuListItemView onClick={ event => processAction('respect') }>
                            { LocalizeText('infostand.button.petrespect', [ 'count' ], [ petRespectRemaining.toString() ]) }
                        </ContextMenuListItemView> }
                </> }
            { (mode === MODE_MONSTER_PLANT) &&
                <>
                    <ContextMenuListItemView onClick={ event => processAction('pick_up') }>
                        { LocalizeText('infostand.button.pickup') }
                    </ContextMenuListItemView>
                    { avatarInfo.dead &&
                        <ContextMenuListItemView onClick={ event => processAction('revive') }>
                            { LocalizeText('infostand.button.revive') }
                        </ContextMenuListItemView> }
                    { roomSession.isRoomOwner &&
                        <ContextMenuListItemView onClick={ event => processAction('compost') }>
                            { LocalizeText('infostand.button.compost') }
                        </ContextMenuListItemView> }
                    { !avatarInfo.dead && ((avatarInfo.energy / avatarInfo.maximumEnergy) < 0.98) &&
                        <ContextMenuListItemView onClick={ event => processAction('treat') }>
                            { LocalizeText('infostand.button.pettreat') }
                        </ContextMenuListItemView> }
                    { !avatarInfo.dead && (avatarInfo.level === avatarInfo.maximumLevel) && avatarInfo.breedable &&
                        <>
                            <ContextMenuListItemView gap={ 1 } onClick={ event => processAction('toggle_breeding_permission') }>
                                <input checked={ avatarInfo.publiclyBreedable } readOnly={ true } type="checkbox" />
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
};
