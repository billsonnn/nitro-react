import { PetRespectComposer, PetType, RoomControllerLevel, RoomObjectCategory, RoomObjectType, RoomObjectVariable, RoomUnitGiveHandItemPetComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { AvatarInfoPet, GetOwnRoomObject, GetSessionDataManager, LocalizeText, SendMessageComposer } from '../../../../../api';
import { usePets, useRoom } from '../../../../../hooks';
import { ContextMenuHeaderView } from '../../context-menu/ContextMenuHeaderView';
import { ContextMenuListItemView } from '../../context-menu/ContextMenuListItemView';
import { ContextMenuView } from '../../context-menu/ContextMenuView';

interface AvatarInfoWidgetPetViewProps
{
    avatarInfo: AvatarInfoPet;
    onClose: () => void;
}

const MODE_NORMAL: number = 0;
const MODE_SADDLED_UP: number = 1;
const MODE_RIDING: number = 2;
const MODE_MONSTER_PLANT: number = 3;

export const AvatarInfoWidgetPetView: FC<AvatarInfoWidgetPetViewProps> = props =>
{
    const { avatarInfo = null, onClose = null } = props;
    const [ mode, setMode ] = useState(MODE_NORMAL);
    const { roomSession = null } = useRoom();
    const { petRespect, changePetRespect } = usePets();

    useEffect(() =>
    {
        changePetRespect(avatarInfo.respectsPetLeft);

    }, [ avatarInfo ]);

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
        let hideMenu = true;

        if(name)
        {
            switch(name)
            {
                case 'respect':
                    let newRespectsLeftChange = 0;

                    changePetRespect(prevValue =>
                    {
                        newRespectsLeftChange = (prevValue - 1);

                        return newRespectsLeftChange;
                    });

                    GetSessionDataManager().givePetRespect(avatarInfo.id);

                    if(newRespectsLeftChange > 0) hideMenu = false;
                    break;
                case 'treat':
                    SendMessageComposer(new PetRespectComposer(avatarInfo.id));
                    break;
                case 'pass_handitem':
                    SendMessageComposer(new RoomUnitGiveHandItemPetComposer(avatarInfo.id));
                    break;
                case 'pick_up':
                    roomSession.pickupPet(avatarInfo.id);
                    break;
                case 'mount':
                    roomSession.mountPet(avatarInfo.id);
                    break;
                case 'dismount':
                    roomSession.dismountPet(avatarInfo.id);
                    break;
            }
        }

        if(hideMenu) onClose();
    }

    useEffect(() =>
    {
        setMode(prevValue =>
        {
            if(avatarInfo.petType === PetType.MONSTERPLANT) return MODE_MONSTER_PLANT;
            else if(avatarInfo.saddle && !avatarInfo.rider) return MODE_SADDLED_UP;
            else if(avatarInfo.rider) return MODE_RIDING;

            return MODE_NORMAL;
        });

        changePetRespect(avatarInfo.respectsPetLeft);

    }, [ avatarInfo ]);

    return (
        <ContextMenuView objectId={ avatarInfo.roomIndex } category={ RoomObjectCategory.UNIT } userType={ RoomObjectType.PET } onClose={ onClose } collapsable={ true }>
            <ContextMenuHeaderView>
                { avatarInfo.name }
            </ContextMenuHeaderView>
            { (mode === MODE_NORMAL) && (petRespect > 0) &&
                <ContextMenuListItemView onClick={ event => processAction('respect') }>
                    { LocalizeText('infostand.button.petrespect', [ 'count' ], [ petRespect.toString() ]) }
                </ContextMenuListItemView> }
            { (mode === MODE_SADDLED_UP) &&
                <>
                    { !!avatarInfo.publiclyRideable &&
                        <ContextMenuListItemView onClick={ event => processAction('mount') }>
                            { LocalizeText('infostand.button.mount') }
                        </ContextMenuListItemView> }
                    { (petRespect > 0) &&
                        <ContextMenuListItemView onClick={ event => processAction('respect') }>
                            { LocalizeText('infostand.button.petrespect', [ 'count' ], [ petRespect.toString() ]) }
                        </ContextMenuListItemView> }
                </> }
            { (mode === MODE_RIDING) &&
                <>
                    <ContextMenuListItemView onClick={ event => processAction('dismount') }>
                        { LocalizeText('infostand.button.dismount') }
                    </ContextMenuListItemView>
                    { (petRespect > 0) &&
                        <ContextMenuListItemView onClick={ event => processAction('respect') }>
                            { LocalizeText('infostand.button.petrespect', [ 'count' ], [ petRespect.toString() ]) }
                        </ContextMenuListItemView> }
                </> }
            { (mode === MODE_MONSTER_PLANT) && !avatarInfo.dead && ((avatarInfo.energy / avatarInfo.maximumEnergy) < 0.98) &&
                <ContextMenuListItemView onClick={ event => processAction('treat') }>
                    { LocalizeText('infostand.button.pettreat') }
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
