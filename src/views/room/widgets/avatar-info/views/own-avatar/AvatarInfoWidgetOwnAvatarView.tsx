import { AvatarAction, AvatarExpressionEnum, RoomObjectCategory } from 'nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetCanStandUp, GetCanUseExpression, GetOwnPosture, HasHabboClub, HasHabboVip, IsRidingHorse } from '../../../../../../api';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { useRoomContext } from '../../../../context/RoomContext';
import { RoomWidgetAvatarExpressionMessage, RoomWidgetChangePostureMessage, RoomWidgetDanceMessage, RoomWidgetMessage, RoomWidgetUserActionMessage } from '../../../../messages';
import { ContextMenuView } from '../../../context-menu/ContextMenuView';
import { ContextMenuHeaderView } from '../../../context-menu/views/header/ContextMenuHeaderView';
import { ContextMenuListItemView } from '../../../context-menu/views/list-item/ContextMenuListItemView';
import { ContextMenuListView } from '../../../context-menu/views/list/ContextMenuListView';
import { AvatarInfoWidgetOwnAvatarViewProps } from './AvatarInfoWidgetOwnAvatarView.types';

const MODE_NORMAL = 0;
const MODE_CLUB_DANCES = 1;
const MODE_NAME_CHANGE = 2;
const MODE_EXPRESSIONS = 3;
const MODE_SIGNS = 4;
const MODE_CHANGE_LOOKS = 5;

export const AvatarInfoWidgetOwnAvatarView: FC<AvatarInfoWidgetOwnAvatarViewProps> = props =>
{
    const { userData = null, isDancing = false, close = null } = props;
    const [ mode, setMode ] = useState((isDancing && HasHabboClub()) ? MODE_CLUB_DANCES : MODE_NORMAL);
    const { roomSession = null, widgetHandler = null } = useRoomContext();

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
                        // if(this.widget.hasClub)
                        // {
                        //     this.widget.isDecorating = true;
                        // }
                        break;
                    case 'change_looks':
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
    }, [ roomSession, userData, widgetHandler, close ]);
    
    const isRidingHorse = IsRidingHorse();

    return (
        <ContextMenuView objectId={ userData.roomIndex } category={ RoomObjectCategory.UNIT } onClose={ close }>
            <ContextMenuHeaderView>
                { userData.name }
            </ContextMenuHeaderView>
            <ContextMenuListView>
                { (mode === MODE_NORMAL) &&
                    <>
                        <ContextMenuListItemView onClick={ event => processAction('decorate') }>
                            { LocalizeText('widget.avatar.decorate') }
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('change_looks') }>
                            { LocalizeText('widget.memenu.myclothes') }
                        </ContextMenuListItemView>
                        { (HasHabboClub() && !isRidingHorse) &&
                            <ContextMenuListItemView onClick={ event => processAction('dance_menu') }>
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
                            { LocalizeText('infostand.link.expressions') }
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('signs') }>
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
                        { (GetCanUseExpression() && HasHabboVip()) &&
                            <ContextMenuListItemView onClick={ event => processAction('laugh') }>
                                { LocalizeText('widget.memenu.laugh') }
                            </ContextMenuListItemView> }
                        { (GetCanUseExpression() && HasHabboVip()) &&
                            <ContextMenuListItemView onClick={ event => processAction('blow') }>
                                { LocalizeText('widget.memenu.blow') }
                                </ContextMenuListItemView> }
                        <ContextMenuListItemView onClick={ event => processAction('idle') }>
                            { LocalizeText('widget.memenu.idle') }
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('back') }>
                            { LocalizeText('generic.back') }
                        </ContextMenuListItemView>
                    </> }
            </ContextMenuListView>
        </ContextMenuView>
    );
}
