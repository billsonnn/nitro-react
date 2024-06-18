import { ContextMenuEnum, CustomUserNotificationMessageEvent, GetSessionDataManager, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { GetGroupInformation, LocalizeText } from '../../../../../api';
import { EFFECTBOX_OPEN, GROUP_FURNITURE, MONSTERPLANT_SEED_CONFIRMATION, MYSTERYTROPHY_OPEN_DIALOG, PURCHASABLE_CLOTHING_CONFIRMATION, useFurnitureContextMenuWidget, useMessageEvent, useNotification } from '../../../../../hooks';
import { ContextMenuHeaderView } from '../../context-menu/ContextMenuHeaderView';
import { ContextMenuListItemView } from '../../context-menu/ContextMenuListItemView';
import { ContextMenuView } from '../../context-menu/ContextMenuView';
import { FurnitureMysteryBoxOpenDialogView } from '../FurnitureMysteryBoxOpenDialogView';
import { FurnitureMysteryTrophyOpenDialogView } from '../FurnitureMysteryTrophyOpenDialogView';
import { EffectBoxConfirmView } from './EffectBoxConfirmView';
import { MonsterPlantSeedConfirmView } from './MonsterPlantSeedConfirmView';
import { PurchasableClothingConfirmView } from './PurchasableClothingConfirmView';

export const FurnitureContextMenuView: FC<{}> = props =>
{
    const { closeConfirm = null, processAction = null, onClose = null, objectId = -1, mode = null, confirmMode = null, confirmingObjectId = -1, groupData = null, isGroupMember = false, objectOwnerId = -1 } = useFurnitureContextMenuWidget();
    const { simpleAlert = null } = useNotification();

    useMessageEvent<CustomUserNotificationMessageEvent>(CustomUserNotificationMessageEvent, event =>
    {
        const parser = event.getParser();

        if(!parser) return;

        // HOPPER_NO_COSTUME = 1; HOPPER_NO_HC = 2; GATE_NO_HC = 3; STARS_NOT_CANDIDATE = 4 (not coded in Emulator); STARS_NOT_ENOUGH_USERS = 5 (not coded in Emulator);

        switch(parser.count)
        {
            case 1:
                simpleAlert(LocalizeText('costumehopper.costumerequired.bodytext'), null, 'catalog/open/temporary_effects' , LocalizeText('costumehopper.costumerequired.buy'), LocalizeText('costumehopper.costumerequired.header'), null);
                break;
            case 2:
                simpleAlert(LocalizeText('viphopper.viprequired.bodytext'), null, 'catalog/open/habbo_club' , LocalizeText('viprequired.buy.vip'), LocalizeText('viprequired.header'), null);
                break;
            case 3:
                simpleAlert(LocalizeText('gate.viprequired.bodytext'), null, 'catalog/open/habbo_club' , LocalizeText('viprequired.buy.vip'), LocalizeText('gate.viprequired.title'), null);
                break;
        }
    });

    const isOwner = GetSessionDataManager().userId === objectOwnerId;

    return (
        <>
            { (confirmMode === MONSTERPLANT_SEED_CONFIRMATION) &&
                <MonsterPlantSeedConfirmView objectId={ confirmingObjectId } onClose={ closeConfirm } /> }
            { (confirmMode === PURCHASABLE_CLOTHING_CONFIRMATION) &&
                <PurchasableClothingConfirmView objectId={ confirmingObjectId } onClose={ closeConfirm } /> }
            { (confirmMode === EFFECTBOX_OPEN) &&
                <EffectBoxConfirmView objectId={ confirmingObjectId } onClose={ closeConfirm } /> }
            { (confirmMode === MYSTERYTROPHY_OPEN_DIALOG) &&
                <FurnitureMysteryTrophyOpenDialogView objectId={ confirmingObjectId } onClose={ closeConfirm } /> }
            <FurnitureMysteryBoxOpenDialogView ownerId={ objectOwnerId } />
            { (objectId >= 0) && mode &&
                <ContextMenuView category={ RoomObjectCategory.FLOOR } fades={ true } objectId={ objectId } onClose={ onClose }>
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
                    { (mode === ContextMenuEnum.MYSTERY_BOX) &&
                        <>
                            <ContextMenuHeaderView>
                                { LocalizeText('mysterybox.context.title') }
                            </ContextMenuHeaderView>
                            <ContextMenuListItemView onClick={ event => processAction('use_mystery_box') }>
                                { LocalizeText('mysterybox.context.' + ((isOwner) ? 'owner' : 'other') + '.use') }
                            </ContextMenuListItemView>
                        </> }
                    { (mode === ContextMenuEnum.MYSTERY_TROPHY) &&
                    <>
                        <ContextMenuHeaderView>
                            { LocalizeText('mysterytrophy.header.title') }
                        </ContextMenuHeaderView>
                        <ContextMenuListItemView onClick={ event => processAction('use_mystery_trophy') }>
                            { LocalizeText('friendfurni.context.use') }
                        </ContextMenuListItemView>
                    </> }
                    { (mode === GROUP_FURNITURE) && groupData &&
                        <>
                            <ContextMenuHeaderView className="cursor-pointer text-truncate" onClick={ () => GetGroupInformation(groupData.guildId) }>
                                { groupData.guildName }
                            </ContextMenuHeaderView>
                            { !isGroupMember &&
                                <ContextMenuListItemView onClick={ event => processAction('join_group') }>
                                    { LocalizeText('widget.furniture.button.join.group') }
                                </ContextMenuListItemView> }
                            <ContextMenuListItemView onClick={ event => processAction('go_to_group_homeroom') }>
                                { LocalizeText('widget.furniture.button.go.to.group.home.room') }
                            </ContextMenuListItemView>
                            { groupData.guildHasReadableForum &&
                                <ContextMenuListItemView onClick={ event => processAction('open_forum') }>
                                    { LocalizeText('widget.furniture.button.open_group_forum') }
                                </ContextMenuListItemView> }
                        </> }
                </ContextMenuView> }
        </>
    );
};
