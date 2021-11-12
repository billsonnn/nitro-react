import { AvatarAction, AvatarExpressionEnum, RoomControllerLevel, RoomObjectCategory, UserProfileComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo, useState } from 'react';
import { GetCanStandUp, GetCanUseExpression, GetOwnPosture, HasHabboClub, HasHabboVip, IsRidingHorse, LocalizeText, RoomWidgetAvatarExpressionMessage, RoomWidgetChangePostureMessage, RoomWidgetDanceMessage, RoomWidgetMessage, RoomWidgetUpdateDecorateModeEvent, RoomWidgetUserActionMessage } from '../../../../../../api';
import { AvatarEditorEvent } from '../../../../../../events';
import { dispatchUiEvent, SendMessageHook } from '../../../../../../hooks';
import { CurrencyIcon } from '../../../../../shared/currency-icon/CurrencyIcon';
import { useRoomContext } from '../../../../context/RoomContext';
import { ContextMenuView } from '../../../context-menu/ContextMenuView';
import { ContextMenuHeaderView } from '../../../context-menu/views/header/ContextMenuHeaderView';
import { ContextMenuListItemView } from '../../../context-menu/views/list-item/ContextMenuListItemView';
import { AvatarInfoWidgetOwnAvatarViewProps } from './AvatarInfoWidgetOwnAvatarView.types';

const MODE_NORMAL = 0;
const MODE_CLUB_DANCES = 1;
const MODE_NAME_CHANGE = 2;
const MODE_EXPRESSIONS = 3;
const MODE_SIGNS = 4;

export const AvatarInfoWidgetOwnAvatarView: FC<AvatarInfoWidgetOwnAvatarViewProps> = props =>
{
    const { userData = null, isDancing = false, close = null } = props;
    const [ mode, setMode ] = useState((isDancing && HasHabboClub()) ? MODE_CLUB_DANCES : MODE_NORMAL);
    const { roomSession = null, eventDispatcher = null, widgetHandler = null } = useRoomContext();

    const processAction = useCallback((name: string) =>
    {
        let message: RoomWidgetMessage = null;
        let hideMenu = true;

        if(name)
        {
            if(name.startsWith('sign_'))
            {
                const sign = parseInt(name.split('_')[1]);

                roomSession.sendSignMessage(sign);
            }
            else
            {
                switch(name)
                {
                    case 'decorate':
                        eventDispatcher.dispatchEvent(new RoomWidgetUpdateDecorateModeEvent(true));
                        break;
                    case 'change_looks':
                        dispatchUiEvent(new AvatarEditorEvent(AvatarEditorEvent.SHOW_EDITOR));
                        break;
                    case 'expressions':
                        hideMenu = false;
                        setMode(MODE_EXPRESSIONS);
                        break;
                    case 'sit':
                        message = new RoomWidgetChangePostureMessage(RoomWidgetChangePostureMessage.POSTURE_SIT);
                        break;
                    case 'stand':
                        message = new RoomWidgetChangePostureMessage(RoomWidgetChangePostureMessage.POSTURE_STAND);
                        break;
                    case 'wave':
                        message = new RoomWidgetAvatarExpressionMessage(AvatarExpressionEnum.WAVE);
                        break;
                    case 'blow':
                        message = new RoomWidgetAvatarExpressionMessage(AvatarExpressionEnum.BLOW);
                        break;
                    case 'laugh':
                        message = new RoomWidgetAvatarExpressionMessage(AvatarExpressionEnum.LAUGH);
                        break;
                    case 'idle':
                        message = new RoomWidgetAvatarExpressionMessage(AvatarExpressionEnum.IDLE);
                        break;
                    case 'dance_menu':
                        hideMenu = false;
                        setMode(MODE_CLUB_DANCES);
                        break;
                    case 'dance':
                        message = new RoomWidgetDanceMessage(1);
                        break;
                    case 'dance_stop':
                        message = new RoomWidgetDanceMessage(0);
                        break;
                    case 'dance_1':
                    case 'dance_2':
                    case 'dance_3':
                    case 'dance_4':
                        message = new RoomWidgetDanceMessage(parseInt(name.charAt((name.length - 1))));
                        break;
                    case 'signs':
                        hideMenu = false;
                        setMode(MODE_SIGNS);
                        break;
                    case 'back':
                        hideMenu = false;
                        setMode(MODE_NORMAL);
                        break;
                    case 'drop_carry_item':
                        message = new RoomWidgetUserActionMessage(RoomWidgetUserActionMessage.DROP_CARRY_ITEM, userData.webID);
                        break;
                }
            }

            if(message) widgetHandler.processWidgetMessage(message);
        }

        if(hideMenu) close();
    }, [ roomSession, eventDispatcher, widgetHandler, userData, close ]);

    const openProfile = useCallback(() =>
    {
        SendMessageHook(new UserProfileComposer(userData.webID));
    }, [ userData ]);

    const isShowDecorate = useMemo(() =>
    {
        return (userData.amIOwner || userData.amIAnyRoomController || (userData.roomControllerLevel > RoomControllerLevel.GUEST));
    }, [ userData ]);
    
    const isRidingHorse = IsRidingHorse();

    return (
        <ContextMenuView objectId={ userData.roomIndex } category={ RoomObjectCategory.UNIT } userType={ userData.userType } close={ close }>
            <ContextMenuHeaderView className="cursor-pointer" onClick={ () => openProfile() }>
                { userData.name }
            </ContextMenuHeaderView>
            { (mode === MODE_NORMAL) &&
                <>
                    { userData.allowNameChange &&
                        <ContextMenuListItemView onClick={ event => processAction('change_name') }>
                            { LocalizeText('widget.avatar.change_name') }
                        </ContextMenuListItemView> }
                    { isShowDecorate &&
                        <ContextMenuListItemView onClick={ event => processAction('decorate') }>
                            { LocalizeText('widget.avatar.decorate') }
                        </ContextMenuListItemView> }
                    <ContextMenuListItemView onClick={ event => processAction('change_looks') }>
                        { LocalizeText('widget.memenu.myclothes') }
                    </ContextMenuListItemView>
                    { (HasHabboClub() && !isRidingHorse) &&
                        <ContextMenuListItemView onClick={ event => processAction('dance_menu') }>
                            <i className="fas fa-chevron-right right" />
                            { LocalizeText('widget.memenu.dance') }
                        </ContextMenuListItemView> }
                    { (!isDancing && !HasHabboClub() && !isRidingHorse) &&
                        <ContextMenuListItemView onClick={ event => processAction('dance') }>
                            { LocalizeText('widget.memenu.dance') }
                        </ContextMenuListItemView> }
                    { (isDancing && !HasHabboClub() && !isRidingHorse) &&
                        <ContextMenuListItemView onClick={ event => processAction('dance_stop') }>
                            { LocalizeText('widget.memenu.dance.stop') }
                        </ContextMenuListItemView> }
                    <ContextMenuListItemView onClick={ event => processAction('expressions') }>
                        <i className="fas fa-chevron-right right" />
                        { LocalizeText('infostand.link.expressions') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('signs') }>
                        <i className="fas fa-chevron-right right" />
                        { LocalizeText('infostand.show.signs') }
                    </ContextMenuListItemView>
                    { (userData.carryItem > 0) &&
                        <ContextMenuListItemView onClick={ event => processAction('drop_carry_item') }>
                            { LocalizeText('avatar.widget.drop_hand_item') }
                        </ContextMenuListItemView> }
                </> }
            { (mode === MODE_CLUB_DANCES) &&
                <>
                    { isDancing &&
                        <ContextMenuListItemView onClick={ event => processAction('dance_stop') }>
                            { LocalizeText('widget.memenu.dance.stop') }
                        </ContextMenuListItemView> }
                    <ContextMenuListItemView onClick={ event => processAction('dance_1') }>
                        { LocalizeText('widget.memenu.dance1') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('dance_2') }>
                        { LocalizeText('widget.memenu.dance2') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('dance_3') }>
                        { LocalizeText('widget.memenu.dance3') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('dance_4') }>
                        { LocalizeText('widget.memenu.dance4') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('back') }>
                        <i className="fas fa-chevron-left left" />
                        { LocalizeText('generic.back') }
                    </ContextMenuListItemView>
                </> }
            { (mode === MODE_EXPRESSIONS) &&
                <>
                    { (GetOwnPosture() === AvatarAction.POSTURE_STAND) &&
                        <ContextMenuListItemView onClick={ event => processAction('sit') }>
                            { LocalizeText('widget.memenu.sit') }
                        </ContextMenuListItemView> }
                    { GetCanStandUp() &&
                        <ContextMenuListItemView onClick={ event => processAction('stand') }>
                            { LocalizeText('widget.memenu.stand') }
                        </ContextMenuListItemView> }
                    { GetCanUseExpression() &&
                        <ContextMenuListItemView onClick={ event => processAction('wave') }>
                            { LocalizeText('widget.memenu.wave') }
                        </ContextMenuListItemView> }
                    { GetCanUseExpression() &&
                        <ContextMenuListItemView canSelect={ HasHabboVip() } onClick={ event => processAction('laugh') }>
                            <CurrencyIcon type="hc" />
                            { LocalizeText('widget.memenu.laugh') }
                        </ContextMenuListItemView> }
                    { GetCanUseExpression() &&
                        <ContextMenuListItemView canSelect={ HasHabboVip() } onClick={ event => processAction('blow') }>
                            <CurrencyIcon type="hc" />
                            { LocalizeText('widget.memenu.blow') }
                        </ContextMenuListItemView> }
                    <ContextMenuListItemView onClick={ event => processAction('idle') }>
                        { LocalizeText('widget.memenu.idle') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('back') }>
                        <i className="fas fa-chevron-left left" />
                        { LocalizeText('generic.back') }
                    </ContextMenuListItemView>
                </> }
            { (mode === MODE_SIGNS) &&
                <>
                    <div className="d-flex menu-list-split-3">
                        <ContextMenuListItemView onClick={ event => processAction('sign_1') }>
                            1
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_2') }>
                            2
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_3') }>
                            3
                        </ContextMenuListItemView>
                    </div>
                    <div className="d-flex menu-list-split-3">
                        <ContextMenuListItemView onClick={ event => processAction('sign_4') }>
                            4
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_5') }>
                            5
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_6') }>
                            6
                        </ContextMenuListItemView>
                    </div>
                    <div className="d-flex menu-list-split-3">
                        <ContextMenuListItemView onClick={ event => processAction('sign_7') }>
                            7
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_8') }>
                            8
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_9') }>
                            9
                        </ContextMenuListItemView>
                    </div>
                    <div className="d-flex menu-list-split-3">
                        <ContextMenuListItemView onClick={ event => processAction('sign_10') }>
                            10
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_0') }>
                            0
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_15') }>
                            <i className="icon icon-sign-smile" />
                        </ContextMenuListItemView>
                    </div>
                    <div className="d-flex menu-list-split-3">
                        <ContextMenuListItemView onClick={ event => processAction('sign_12') }>
                            <i className="icon icon-sign-skull" />
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_14') }>
                            <i className="icon icon-sign-soccer" />
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_17') }>
                            <i className="icon icon-sign-yellow" />
                        </ContextMenuListItemView>
                    </div>
                    <div className="d-flex menu-list-split-3">
                        <ContextMenuListItemView onClick={ event => processAction('sign_16') }>
                            <i className="icon icon-sign-red" />
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_13') }>
                            <i className="icon icon-sign-exclamation" />
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('sign_11') }>
                            <i className="icon icon-sign-heart" />
                        </ContextMenuListItemView>
                    </div>
                    <ContextMenuListItemView onClick={ event => processAction('back') }>
                        <i className="fas fa-chevron-left left" />
                        { LocalizeText('generic.back') }
                    </ContextMenuListItemView>
                </> }
        </ContextMenuView>
    );
}
