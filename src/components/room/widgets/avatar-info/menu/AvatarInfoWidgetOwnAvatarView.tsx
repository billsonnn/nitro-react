import { AvatarAction, AvatarExpressionEnum, RoomControllerLevel, RoomObjectCategory, RoomUnitDropHandItemComposer } from "@nitrots/nitro-renderer"
import { Dispatch, FC, SetStateAction, useState } from "react"
import { AvatarInfoUser, CreateLinkEvent, DispatchUiEvent, GetCanStandUp, GetCanUseExpression, GetOwnPosture, GetUserProfile, HasHabboClub, HasHabboVip, IsRidingHorse, LocalizeText, PostureTypeEnum, SendMessageComposer } from "../../../../../api"
import { HelpNameChangeEvent } from "../../../../../events"
import { useRoom } from "../../../../../hooks"
import { ContextMenuHeaderView } from "../../context-menu/ContextMenuHeaderView"
import { ContextMenuListItemView } from "../../context-menu/ContextMenuListItemView"
import { ContextMenuView } from "../../context-menu/ContextMenuView"

interface AvatarInfoWidgetOwnAvatarViewProps
{
    avatarInfo: AvatarInfoUser;
    isDancing: boolean;
    setIsDecorating: Dispatch<SetStateAction<boolean>>;
    onClose: () => void;
}

const MODE_NORMAL = 0
const MODE_CLUB_DANCES = 1
const MODE_NAME_CHANGE = 2
const MODE_EXPRESSIONS = 3
const MODE_SIGNS = 4

export const AvatarInfoWidgetOwnAvatarView: FC<AvatarInfoWidgetOwnAvatarViewProps> = props =>
{
    const { avatarInfo = null, isDancing = false, setIsDecorating = null, onClose = null } = props
    const [ mode, setMode ] = useState((isDancing && HasHabboClub()) ? MODE_CLUB_DANCES : MODE_NORMAL)
    const { roomSession = null } = useRoom()

    const processAction = (name: string) =>
    {
        let hideMenu = true

        if(name)
        {
            if(name.startsWith("sign_"))
            {
                const sign = parseInt(name.split("_")[1])

                roomSession.sendSignMessage(sign)
            }
            else
            {
                switch(name)
                {
                case "decorate":
                    setIsDecorating(true)
                    break
                case "change_name":
                    DispatchUiEvent(new HelpNameChangeEvent(HelpNameChangeEvent.INIT))
                    break
                case "change_looks":
                    CreateLinkEvent("avatar-editor/show")
                    break
                case "expressions":
                    hideMenu = false
                    setMode(MODE_EXPRESSIONS)
                    break
                case "sit":
                    roomSession.sendPostureMessage(PostureTypeEnum.POSTURE_SIT)
                    break
                case "stand":
                    roomSession.sendPostureMessage(PostureTypeEnum.POSTURE_STAND)
                    break
                case "wave":
                    roomSession.sendExpressionMessage(AvatarExpressionEnum.WAVE.ordinal)
                    break
                case "blow":
                    roomSession.sendExpressionMessage(AvatarExpressionEnum.BLOW.ordinal)
                    break
                case "laugh":
                    roomSession.sendExpressionMessage(AvatarExpressionEnum.LAUGH.ordinal)
                    break
                case "idle":
                    roomSession.sendExpressionMessage(AvatarExpressionEnum.IDLE.ordinal)
                    break
                case "dance_menu":
                    hideMenu = false
                    setMode(MODE_CLUB_DANCES)
                    break
                case "dance":
                    roomSession.sendDanceMessage(1)
                    break
                case "dance_stop":
                    roomSession.sendDanceMessage(0)
                    break
                case "dance_1":
                case "dance_2":
                case "dance_3":
                case "dance_4":
                    roomSession.sendDanceMessage(parseInt(name.charAt((name.length - 1))))
                    break
                case "signs":
                    hideMenu = false
                    setMode(MODE_SIGNS)
                    break
                case "back":
                    hideMenu = false
                    setMode(MODE_NORMAL)
                    break
                case "drop_carry_item":
                    SendMessageComposer(new RoomUnitDropHandItemComposer())
                    break
                }
            }
        }

        if(hideMenu) onClose()
    }

    const isShowDecorate = () => (avatarInfo.amIOwner || avatarInfo.amIAnyRoomController || (avatarInfo.roomControllerLevel > RoomControllerLevel.GUEST))
    
    const isRidingHorse = IsRidingHorse()

    return (
        <ContextMenuView objectId={ avatarInfo.roomIndex } category={ RoomObjectCategory.UNIT } userType={ avatarInfo.userType } onClose={ onClose } collapsable={ true }>
            
            <ContextMenuHeaderView className="cursor-pointer" onClick={ event => GetUserProfile(avatarInfo.webID) }>
                { avatarInfo.name }
            </ContextMenuHeaderView>
            { (mode === MODE_NORMAL) &&
                <>
                    { avatarInfo.allowNameChange &&
                        <ContextMenuListItemView onClick={ event => processAction("change_name") }>
                            { LocalizeText("widget.avatar.change_name") }
                        </ContextMenuListItemView> }
                    <ContextMenuListItemView onClick={ event => processAction("change_looks") }>
                        { LocalizeText("widget.memenu.myclothes") }
                    </ContextMenuListItemView>
                    { (HasHabboClub() && !isRidingHorse) &&
                        <ContextMenuListItemView onClick={ event => processAction("dance_menu") }>
                            { LocalizeText("widget.memenu.dance") }
                            <i className="block h-[9px] w-[5px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-214px_-100px]" />
                        </ContextMenuListItemView> }
                    { (!isDancing && !HasHabboClub() && !isRidingHorse) &&
                        <ContextMenuListItemView onClick={ event => processAction("dance") }>
                            { LocalizeText("widget.memenu.dance") }
                        </ContextMenuListItemView> }
                    { (isDancing && !HasHabboClub() && !isRidingHorse) &&
                        <ContextMenuListItemView onClick={ event => processAction("dance_stop") }>
                            { LocalizeText("widget.memenu.dance.stop") }
                        </ContextMenuListItemView> }
                    <ContextMenuListItemView onClick={ event => processAction("expressions") }>
                        { LocalizeText("infostand.link.expressions") }
                        <i className="block h-[9px] w-[5px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-214px_-100px]" />
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction("signs") }>
                        { LocalizeText("infostand.show.signs") }
                        <i className="block h-[9px] w-[5px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-214px_-100px]" />
                    </ContextMenuListItemView>
                    { (avatarInfo.carryItem > 0) &&
                        <ContextMenuListItemView onClick={ event => processAction("drop_carry_item") }>
                            { LocalizeText("avatar.widget.drop_hand_item") }
                        </ContextMenuListItemView> }
                    <div className="flex items-center justify-end gap-1.5">
                        <div className="illumina-btn-group">
                            <button className="illumina-btn-primary flex h-7 items-center justify-center pl-2" onClick={ event => GetUserProfile(avatarInfo.webID) }>
                                <i className="block h-3 w-4 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-436px_0px]" />
                            </button>
                            <button className="illumina-btn-primary flex h-7 w-[15px] items-center justify-center" disabled>
                                <div className="h-[13px] w-0.5 border-r border-[#919191] bg-white dark:border-[#36322C] dark:bg-black" />
                            </button>
                            <button className="illumina-btn-primary flex h-7 items-center justify-center pr-2" disabled>
                                <i className="block h-3.5 w-4 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-180px_-83px]" />
                            </button>
                        </div>
                    </div>
                </> }
            { (mode === MODE_CLUB_DANCES) &&
                <>
                    { isDancing &&
                        <ContextMenuListItemView onClick={ event => processAction("dance_stop") }>
                            { LocalizeText("widget.memenu.dance.stop") }
                        </ContextMenuListItemView> }
                    <ContextMenuListItemView onClick={ event => processAction("dance_1") }>
                        { LocalizeText("widget.memenu.dance1") }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction("dance_2") }>
                        { LocalizeText("widget.memenu.dance2") }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction("dance_3") }>
                        { LocalizeText("widget.memenu.dance3") }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction("dance_4") }>
                        { LocalizeText("widget.memenu.dance4") }
                    </ContextMenuListItemView>
                    <div className="mb-[11px] mt-0 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    <ContextMenuListItemView onClick={ event => processAction("back") }>
                        <i className="block h-[9px] w-[5px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-220px_-100px]" />
                        <p className="ml-1.5 w-full text-xs font-semibold text-[#636363] [text-shadow:_0_1px_0_#fff] dark:text-[#737067] dark:[text-shadow:_0_1px_0_#33312B]">
                            { LocalizeText("generic.back") }
                        </p>
                    </ContextMenuListItemView>
                </> }
            { (mode === MODE_EXPRESSIONS) &&
                <>
                    { (GetOwnPosture() === AvatarAction.POSTURE_STAND) &&
                        <ContextMenuListItemView onClick={ event => processAction("sit") }>
                            { LocalizeText("widget.memenu.sit") }
                        </ContextMenuListItemView> }
                    { GetCanStandUp() &&
                        <ContextMenuListItemView onClick={ event => processAction("stand") }>
                            { LocalizeText("widget.memenu.stand") }
                        </ContextMenuListItemView> }
                    { GetCanUseExpression() &&
                        <ContextMenuListItemView onClick={ event => processAction("wave") }>
                            { LocalizeText("widget.memenu.wave") }
                        </ContextMenuListItemView> }
                    { GetCanUseExpression() &&
                        <ContextMenuListItemView disabled={ !HasHabboVip() } onClick={ event => processAction("laugh") }>
                            { LocalizeText("widget.memenu.laugh") }
                            { !HasHabboVip() && <i className="block h-[9px] w-2.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-298px_-69px]" /> }
                        </ContextMenuListItemView> }
                    { GetCanUseExpression() &&
                        <ContextMenuListItemView disabled={ !HasHabboVip() } onClick={ event => processAction("blow") }>
                            { LocalizeText("widget.memenu.blow") }
                            { !HasHabboVip() && <i className="block h-[9px] w-2.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-298px_-69px]" /> }
                        </ContextMenuListItemView> }
                    <ContextMenuListItemView onClick={ event => processAction("idle") }>
                        { LocalizeText("widget.memenu.idle") }
                    </ContextMenuListItemView>
                    <div className="mb-[11px] mt-0 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    <ContextMenuListItemView onClick={ event => processAction("back") }>
                        <i className="block h-[9px] w-[5px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-220px_-100px]" />
                        <p className="ml-1.5 w-full text-xs font-semibold text-[#636363] [text-shadow:_0_1px_0_#fff] dark:text-[#737067] dark:[text-shadow:_0_1px_0_#33312B]">
                            { LocalizeText("generic.back") }
                        </p>
                    </ContextMenuListItemView>
                </> }
            { (mode === MODE_SIGNS) &&
                <>
                    <div className="grid grid-cols-3">
                        <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("sign_1") }>
                            1
                        </ContextMenuListItemView>
                        <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("sign_2") }>
                            2
                        </ContextMenuListItemView>
                        <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("sign_3") }>
                            3
                        </ContextMenuListItemView>
                        <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("sign_4") }>
                            4
                        </ContextMenuListItemView>
                        <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("sign_5") }>
                            5
                        </ContextMenuListItemView>
                        <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("sign_6") }>
                            6
                        </ContextMenuListItemView>
                        <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("sign_7") }>
                            7
                        </ContextMenuListItemView>
                        <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("sign_8") }>
                            8
                        </ContextMenuListItemView>
                        <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("sign_9") }>
                            9
                        </ContextMenuListItemView>
                        <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("sign_10") }>
                            10
                        </ContextMenuListItemView>
                        <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("sign_11") }>
                            <i className="block h-[13px] w-[15px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-447px_-106px]" />
                        </ContextMenuListItemView>
                        <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("sign_12") }>
                            <i className="block size-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-434px_-106px]" />
                        </ContextMenuListItemView>
                        <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("sign_0") }>
                            0
                        </ContextMenuListItemView>
                        <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("sign_13") }>
                            <i className="block h-[17px] w-[7px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-426px_-106px]" />
                        </ContextMenuListItemView>
                        <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("sign_15") }>
                            <p>:)</p>
                        </ContextMenuListItemView>
                        <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("sign_14") }>
                            <i className="block size-5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-397px_-106px]" />
                        </ContextMenuListItemView>
                        <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("sign_17") }>
                            <i className="block h-[19px] w-[11px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-385px_-106px]" />
                        </ContextMenuListItemView>
                        <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("sign_16") }>
                            <i className="block h-[19px] w-[11px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-373px_-106px]" />
                        </ContextMenuListItemView>
                    </div>
                    <div className="mb-[11px] mt-0 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    <ContextMenuListItemView onClick={ event => processAction("back") }>
                        <i className="block h-[9px] w-[5px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-220px_-100px]" />
                        <p className="ml-1.5 w-full text-xs font-semibold text-[#636363] [text-shadow:_0_1px_0_#fff] dark:text-[#737067] dark:[text-shadow:_0_1px_0_#33312B]">
                            { LocalizeText("generic.back") }
                        </p>
                    </ContextMenuListItemView>
                </> }
        </ContextMenuView>
    )
}
