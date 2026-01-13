import { RoomControllerLevel, RoomObjectCategory, RoomObjectVariable, RoomUnitGiveHandItemComposer, SetRelationshipStatusComposer, TradingOpenComposer } from "@nitrots/nitro-renderer"
import { FC, useEffect, useMemo, useState } from "react"
import { AvatarInfoUser, CreateLinkEvent, DispatchUiEvent, GetOwnRoomObject, GetSessionDataManager, GetUserProfile, LocalizeText, MessengerFriend, ReportType, RoomWidgetUpdateChatInputContentEvent, SendMessageComposer } from "../../../../../api"
import { useFriends, useHelp, useRoom, useSessionInfo } from "../../../../../hooks"
import { ContextMenuHeaderView } from "../../context-menu/ContextMenuHeaderView"
import { ContextMenuListItemView } from "../../context-menu/ContextMenuListItemView"
import { ContextMenuView } from "../../context-menu/ContextMenuView"

interface AvatarInfoWidgetAvatarViewProps
{
    avatarInfo: AvatarInfoUser;
    onClose: () => void;
}

const MODE_NORMAL = 0
const MODE_MODERATE = 1
const MODE_MODERATE_BAN = 2
const MODE_MODERATE_MUTE = 3
const MODE_AMBASSADOR = 4
const MODE_AMBASSADOR_MUTE = 5
const MODE_RELATIONSHIP = 6

export const AvatarInfoWidgetAvatarView: FC<AvatarInfoWidgetAvatarViewProps> = props =>
{
    const { avatarInfo = null, onClose = null } = props
    const [ mode, setMode ] = useState(MODE_NORMAL)
    const { canRequestFriend = null, getFriend = null } = useFriends()
    const { report = null } = useHelp()
    const { roomSession = null } = useRoom()
    const { userRespectRemaining = 0, respectUser = null } = useSessionInfo()

    const isShowGiveRights = useMemo(() =>
    {
        return (avatarInfo.amIOwner && (avatarInfo.targetRoomControllerLevel < RoomControllerLevel.GUEST) && !avatarInfo.isGuildRoom)
    }, [ avatarInfo ])

    const isShowRemoveRights = useMemo(() =>
    {
        return (avatarInfo.amIOwner && (avatarInfo.targetRoomControllerLevel === RoomControllerLevel.GUEST) && !avatarInfo.isGuildRoom)
    }, [ avatarInfo ])

    const moderateMenuHasContent = useMemo(() =>
    {
        return (avatarInfo.canBeKicked || avatarInfo.canBeBanned || avatarInfo.canBeMuted || isShowGiveRights || isShowRemoveRights)
    }, [ isShowGiveRights, isShowRemoveRights, avatarInfo ])

    const canGiveHandItem = useMemo(() =>
    {
        let flag = false

        const roomObject = GetOwnRoomObject()

        if(roomObject)
        {
            const carryId = roomObject.model.getValue<number>(RoomObjectVariable.FIGURE_CARRY_OBJECT)

            if((carryId > 0) && (carryId < 999999)) flag = true
        }

        return flag
    }, [])

    const processAction = (name: string) =>
    {
        let hideMenu = true

        if(name)
        {
            switch(name)
            {
            case "moderate":
                hideMenu = false
                setMode(MODE_MODERATE)
                break
            case "ban":
                hideMenu = false
                setMode(MODE_MODERATE_BAN)
                break
            case "mute":
                hideMenu = false
                setMode(MODE_MODERATE_MUTE)
                break
            case "ambassador":
                hideMenu = false
                setMode(MODE_AMBASSADOR)
                break
            case "ambassador_mute":
                hideMenu = false
                setMode(MODE_AMBASSADOR_MUTE)
                break
            case "back_moderate":
                hideMenu = false
                setMode(MODE_MODERATE)
                break
            case "back_ambassador":
                hideMenu = false
                setMode(MODE_AMBASSADOR)
                break
            case "back":
                hideMenu = false
                setMode(MODE_NORMAL)
                break
            case "whisper":
                DispatchUiEvent(new RoomWidgetUpdateChatInputContentEvent(RoomWidgetUpdateChatInputContentEvent.WHISPER, avatarInfo.name))
                break
            case "friend":
                CreateLinkEvent(`friends/request/${ avatarInfo.webID }/${ avatarInfo.name }`)
                break
            case "relationship":
                hideMenu = false
                setMode(MODE_RELATIONSHIP)
                break
            case "respect": {
                respectUser(avatarInfo.webID)

                if((userRespectRemaining - 1) >= 1) hideMenu = false
                break
            }
            case "ignore":
                GetSessionDataManager().ignoreUser(avatarInfo.name)
                break
            case "unignore":
                GetSessionDataManager().unignoreUser(avatarInfo.name)
                break
            case "kick":
                roomSession.sendKickMessage(avatarInfo.webID)
                break
            case "ban_hour":
                roomSession.sendBanMessage(avatarInfo.webID, "RWUAM_BAN_USER_HOUR")
                break
            case "ban_day":
                roomSession.sendBanMessage(avatarInfo.webID, "RWUAM_BAN_USER_DAY")
                break
            case "perm_ban":
                roomSession.sendBanMessage(avatarInfo.webID, "RWUAM_BAN_USER_PERM")
                break
            case "mute_2min":
                roomSession.sendMuteMessage(avatarInfo.webID, 2)
                break
            case "mute_5min":
                roomSession.sendMuteMessage(avatarInfo.webID, 5)
                break
            case "mute_10min":
                roomSession.sendMuteMessage(avatarInfo.webID, 10)
                break
            case "give_rights":
                roomSession.sendGiveRightsMessage(avatarInfo.webID)
                break
            case "remove_rights":
                roomSession.sendTakeRightsMessage(avatarInfo.webID)
                break
            case "trade":
                SendMessageComposer(new TradingOpenComposer(avatarInfo.roomIndex))
                break
            case "report":
                report(ReportType.BULLY, { reportedUserId: avatarInfo.webID })
                break
            case "pass_hand_item":
                SendMessageComposer(new RoomUnitGiveHandItemComposer(avatarInfo.webID))
                break
            case "ambassador_alert":
                roomSession.sendAmbassadorAlertMessage(avatarInfo.webID)
                break
            case "ambassador_kick":
                roomSession.sendKickMessage(avatarInfo.webID)
                break
            case "ambassador_mute_2min":
                roomSession.sendMuteMessage(avatarInfo.webID, 2)
                break
            case "ambassador_mute_10min":
                roomSession.sendMuteMessage(avatarInfo.webID, 10)
                break
            case "ambassador_mute_60min":
                roomSession.sendMuteMessage(avatarInfo.webID, 60)
                break
            case "ambassador_mute_18hour":
                roomSession.sendMuteMessage(avatarInfo.webID, 1080)
                break
            case "rship_heart":
                SendMessageComposer(new SetRelationshipStatusComposer(avatarInfo.webID, MessengerFriend.RELATIONSHIP_HEART))
                break
            case "rship_smile":
                SendMessageComposer(new SetRelationshipStatusComposer(avatarInfo.webID, MessengerFriend.RELATIONSHIP_SMILE))
                break
            case "rship_bobba":
                SendMessageComposer(new SetRelationshipStatusComposer(avatarInfo.webID, MessengerFriend.RELATIONSHIP_BOBBA))
                break
            case "rship_none":
                SendMessageComposer(new SetRelationshipStatusComposer(avatarInfo.webID, MessengerFriend.RELATIONSHIP_NONE))
                break
            }
        }

        if(hideMenu) onClose()
    }

    useEffect(() =>
    {
        setMode(MODE_NORMAL)
    }, [ avatarInfo ])

    return (
        <ContextMenuView objectId={ avatarInfo.roomIndex } category={ RoomObjectCategory.UNIT } userType={ avatarInfo.userType } onClose={ onClose } collapsable={ true }>
            <ContextMenuHeaderView className="cursor-pointer" onClick={ event => GetUserProfile(avatarInfo.webID) }>
                { avatarInfo.name }
            </ContextMenuHeaderView>
            { (mode === MODE_NORMAL) &&
                <>
                    <ContextMenuListItemView onClick={ event => processAction("trade") }>
                        { LocalizeText("infostand.button.trade") }
                    </ContextMenuListItemView>
                    { (userRespectRemaining > 0) &&
                        <ContextMenuListItemView onClick={ event => processAction("respect") }>
                            { LocalizeText("infostand.button.respect", [ "count" ], [ userRespectRemaining.toString() ]) }
                        </ContextMenuListItemView> }
                    { getFriend(avatarInfo.webID) &&
                        <ContextMenuListItemView onClick={ event => processAction("relationship") }>
                            { LocalizeText("infostand.link.relationship") }
                            <i className="block h-[9px] w-[5px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-214px_-100px]" />
                        </ContextMenuListItemView> }
                    { !avatarInfo.isIgnored &&
                        <ContextMenuListItemView onClick={ event => processAction("ignore") }>
                            { LocalizeText("infostand.button.ignore") }
                        </ContextMenuListItemView> }
                    { avatarInfo.isIgnored &&
                        <ContextMenuListItemView onClick={ event => processAction("unignore") }>
                            { LocalizeText("infostand.button.unignore") }
                        </ContextMenuListItemView> }
                    { moderateMenuHasContent &&
                        <ContextMenuListItemView onClick={ event => processAction("moderate") }>
                            { LocalizeText("infostand.link.moderate") }
                            <i className="block h-[9px] w-[5px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-214px_-100px]" />
                        </ContextMenuListItemView> }
                    { avatarInfo.isAmbassador &&
                        <ContextMenuListItemView onClick={ event => processAction("ambassador") }>
                            { LocalizeText("infostand.link.ambassador") }
                            <i className="block h-[9px] w-[5px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-214px_-100px]" />
                        </ContextMenuListItemView> }
                    { canGiveHandItem && <ContextMenuListItemView onClick={ event => processAction("pass_hand_item") }>
                        { LocalizeText("avatar.widget.pass_hand_item") }
                    </ContextMenuListItemView> }
                    <div className="flex items-center justify-end gap-1.5">
                        <button className="illumina-btn-primary flex size-7 items-center justify-center" onClick={ event => GetUserProfile(avatarInfo.webID) }>
                            <i className="block h-3 w-4 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-436px_0px]" />
                        </button>
                        <div className="illumina-btn-group flex">
                            { canRequestFriend(avatarInfo.webID) && <>
                                <button className="illumina-btn-primary flex h-7 items-center justify-center pl-2">
                                    <i className="block size-4 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-197px_-100px]" onClick={ event => processAction("friend") } />
                                </button> 
                                <button className="illumina-btn-primary flex h-7 w-[15px] items-center justify-center" disabled>
                                    <div className="h-[13px] w-0.5 border-r border-[#919191] bg-white dark:border-[#36322C] dark:bg-black" />
                                </button>
                            </> }
                            <button className={`illumina-btn-primary flex h-7 items-center justify-center ${!canRequestFriend(avatarInfo.webID) ? "pl-2" : ""}`}>
                                <i className="block size-3.5 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-180px_-98px]" onClick={ event => processAction("whisper") } />
                            </button>
                            <button className="illumina-btn-primary flex h-7 w-[15px] items-center justify-center" disabled>
                                <div className="h-[13px] w-0.5 border-r border-[#919191] bg-white dark:border-[#36322C] dark:bg-black" />
                            </button>
                            <button className="illumina-btn-primary flex h-7 items-center justify-center pr-2">
                                <i className="block h-4 w-[15px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-213px_-83px]" onClick={ event => processAction("report") } />
                            </button>
                        </div>
                    </div>
                </> }
            { (mode === MODE_MODERATE) &&
                <>
                    <ContextMenuListItemView onClick={ event => processAction("kick") }>
                        { LocalizeText("infostand.button.kick") }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction("mute") }>
                        { LocalizeText("infostand.button.mute") }
                        <i className="block h-[9px] w-[5px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-214px_-100px]" />
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction("ban") }>
                        { LocalizeText("infostand.button.ban") }
                        <i className="block h-[9px] w-[5px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-214px_-100px]" />
                    </ContextMenuListItemView>
                    { isShowGiveRights &&
                        <ContextMenuListItemView onClick={ event => processAction("give_rights") }>
                            { LocalizeText("infostand.button.giverights") }
                        </ContextMenuListItemView> }
                    { isShowRemoveRights &&
                        <ContextMenuListItemView onClick={ event => processAction("remove_rights") }>
                            { LocalizeText("infostand.button.removerights") }
                        </ContextMenuListItemView> }
                    <div className="mb-[11px] mt-0 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    <ContextMenuListItemView onClick={ event => processAction("back") }>
                        <i className="block h-[9px] w-[5px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-220px_-100px]" />
                        <p className="ml-1.5 w-full text-xs font-semibold text-[#636363] [text-shadow:_0_1px_0_#fff] dark:text-[#737067] dark:[text-shadow:_0_1px_0_#33312B]">
                            { LocalizeText("generic.back") }
                        </p>
                    </ContextMenuListItemView>
                </> }
            { (mode === MODE_MODERATE_BAN) &&
                <>
                    <ContextMenuListItemView onClick={ event => processAction("ban_hour") }>
                        { LocalizeText("infostand.button.ban_hour") }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction("ban_day") }>
                        { LocalizeText("infostand.button.ban_day") }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction("perm_ban") }>
                        { LocalizeText("infostand.button.perm_ban") }
                    </ContextMenuListItemView>
                    <div className="mb-[11px] mt-0 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    <ContextMenuListItemView onClick={ event => processAction("back_moderate") }>
                        <i className="block h-[9px] w-[5px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-220px_-100px]" />
                        <p className="ml-1.5 w-full text-xs font-semibold text-[#636363] [text-shadow:_0_1px_0_#fff] dark:text-[#737067] dark:[text-shadow:_0_1px_0_#33312B]">
                            { LocalizeText("generic.back") }
                        </p>
                    </ContextMenuListItemView>
                </> }
            { (mode === MODE_MODERATE_MUTE) &&
                <>
                    <ContextMenuListItemView onClick={ event => processAction("mute_2min") }>
                        { LocalizeText("infostand.button.mute_2min") }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction("mute_5min") }>
                        { LocalizeText("infostand.button.mute_5min") }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction("mute_10min") }>
                        { LocalizeText("infostand.button.mute_10min") }
                    </ContextMenuListItemView>
                    <div className="mb-[11px] mt-0 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    <ContextMenuListItemView onClick={ event => processAction("back_moderate") }>
                        <i className="block h-[9px] w-[5px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-220px_-100px]" />
                        <p className="ml-1.5 w-full text-xs font-semibold text-[#636363] [text-shadow:_0_1px_0_#fff] dark:text-[#737067] dark:[text-shadow:_0_1px_0_#33312B]">
                            { LocalizeText("generic.back") }
                        </p>
                    </ContextMenuListItemView>
                </> }
            { (mode === MODE_AMBASSADOR) &&
                <>
                    <ContextMenuListItemView onClick={ event => processAction("ambassador_alert") }>
                        { LocalizeText("infostand.button.alert") }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction("ambassador_kick") }>
                        { LocalizeText("infostand.button.kick") }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction("ambassador_mute") }>
                        { LocalizeText("infostand.button.mute") }
                        <i className="block h-[9px] w-[5px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-214px_-100px]" />
                    </ContextMenuListItemView>
                    <div className="mb-[11px] mt-0 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    <ContextMenuListItemView onClick={ event => processAction("back") }>
                        <i className="block h-[9px] w-[5px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-220px_-100px]" />
                        <p className="ml-1.5 w-full text-xs font-semibold text-[#636363] [text-shadow:_0_1px_0_#fff] dark:text-[#737067] dark:[text-shadow:_0_1px_0_#33312B]">
                            { LocalizeText("generic.back") }
                        </p>
                    </ContextMenuListItemView>
                </> }
            { (mode === MODE_AMBASSADOR_MUTE) &&
                <>
                    <ContextMenuListItemView onClick={ event => processAction("ambassador_mute_2min") }>
                        { LocalizeText("infostand.button.mute_2min") }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction("ambassador_mute_10min") }>
                        { LocalizeText("infostand.button.mute_10min") }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction("ambassador_mute_60min") }>
                        { LocalizeText("infostand.button.mute_60min") }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction("ambassador_mute_18hr") }>
                        { LocalizeText("infostand.button.mute_18hour") }
                    </ContextMenuListItemView>
                    <div className="mb-[11px] mt-0 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    <ContextMenuListItemView onClick={ event => processAction("back_ambassador") }>
                        <i className="block h-[9px] w-[5px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-220px_-100px]" />
                        <p className="ml-1.5 w-full text-xs font-semibold text-[#636363] [text-shadow:_0_1px_0_#fff] dark:text-[#737067] dark:[text-shadow:_0_1px_0_#33312B]">
                            { LocalizeText("generic.back") }
                        </p>
                    </ContextMenuListItemView>
                </> }
            { (mode === MODE_RELATIONSHIP) &&
                <>
                    <div className="grid grid-cols-3">
                        <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("rship_heart") }>
                            <i className="h-3.5 w-[13px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-292px_-23px]" />
                        </ContextMenuListItemView>
                        <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("rship_smile") }>
                            <i className="h-3.5 w-[13px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-320px_-23px]" />
                        </ContextMenuListItemView>
                        <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("rship_bobba") }>
                            <i className="h-3.5 w-[13px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-306px_-23px]" />
                        </ContextMenuListItemView>
                    </div>
                    <ContextMenuListItemView className="!justify-center" onClick={ event => processAction("rship_none") }>
                        { LocalizeText("avatar.widget.clear_relationship") }
                    </ContextMenuListItemView>
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
