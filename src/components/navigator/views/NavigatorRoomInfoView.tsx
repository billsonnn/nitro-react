import { GetCustomRoomFilterMessageComposer, NavigatorSearchComposer, RoomMuteComposer, RoomSettingsComposer, SecurityLevel, ToggleStaffPickMessageComposer, UpdateHomeRoomMessageComposer } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { CreateLinkEvent, DispatchUiEvent, GetGroupInformation, GetSessionDataManager, GetUserProfile, LocalizeText, ReportType, SendMessageComposer } from "../../../api"
import { Button, LayoutBadgeImageView, LayoutRoomThumbnailView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../common"
import { RoomWidgetThumbnailEvent } from "../../../events"
import { useHelp, useNavigator } from "../../../hooks"

export class NavigatorRoomInfoViewProps {
    onCloseClick: () => void
}

export const NavigatorRoomInfoView: FC<NavigatorRoomInfoViewProps> = props => {
    const { onCloseClick = null } = props
    const [ isRoomPicked, setIsRoomPicked ] = useState(false)
    const [ isRoomMuted, setIsRoomMuted ] = useState(false)
    const { report = null } = useHelp()
    const { navigatorData = null } = useNavigator()

    const customUrl = navigatorData.enteredGuestRoom.officialRoomPicRef
    const roomId = navigatorData.enteredGuestRoom.roomId

    const hasPermission = (permission: string) => {
        switch (permission) {
        case "settings":
            return (GetSessionDataManager().userId === navigatorData.enteredGuestRoom.ownerId || GetSessionDataManager().isModerator)
        case "staff_pick":
            return GetSessionDataManager().securityLevel >= SecurityLevel.COMMUNITY
        default: return false
        }
    }

    const processAction = (action: string, value?: string) => {
        if (!navigatorData || !navigatorData.enteredGuestRoom) return

        switch (action) {
        case "set_home_room":
            let newRoomId = -1

            if (navigatorData.homeRoomId !== navigatorData.enteredGuestRoom.roomId) {
                newRoomId = navigatorData.enteredGuestRoom.roomId
            }

            if (newRoomId > 0) SendMessageComposer(new UpdateHomeRoomMessageComposer(newRoomId))
            return
        case "navigator_search_tag":
            CreateLinkEvent(`navigator/search/${value}`)
            SendMessageComposer(new NavigatorSearchComposer("hotel_view", `tag:${value}`))
            return
        case "open_room_thumbnail_camera":
            DispatchUiEvent(new RoomWidgetThumbnailEvent(RoomWidgetThumbnailEvent.TOGGLE_THUMBNAIL))
            onCloseClick()
            return
        case "open_group_info":
            GetGroupInformation(navigatorData.enteredGuestRoom.habboGroupId)
            return
        case "toggle_room_link":
            CreateLinkEvent("navigator/toggle-room-link")
            return
        case "open_room_settings":
            SendMessageComposer(new RoomSettingsComposer(navigatorData.enteredGuestRoom.roomId))
            onCloseClick()
            return
        case "toggle_pick":
            setIsRoomPicked(value => !value)
            SendMessageComposer(new ToggleStaffPickMessageComposer(navigatorData.enteredGuestRoom.roomId))
            return
        case "toggle_mute":
            setIsRoomMuted(value => !value)
            SendMessageComposer(new RoomMuteComposer())
            return
        case "room_filter":
            SendMessageComposer(new GetCustomRoomFilterMessageComposer(navigatorData.enteredGuestRoom.roomId))
            return
        case "open_floorplan_editor":
            CreateLinkEvent("floor-editor/toggle")
            onCloseClick()
            return
        case "report_room":
            report(ReportType.ROOM, { roomId: navigatorData.enteredGuestRoom.roomId, roomName: navigatorData.enteredGuestRoom.roomName })
            return
        case "close":
            onCloseClick()
            return
        }
    }

    useEffect(() => {
        if (!navigatorData) return

        setIsRoomPicked(navigatorData.currentRoomIsStaffPick)

        if (navigatorData.enteredGuestRoom) setIsRoomMuted(navigatorData.enteredGuestRoom.allInRoomMuted)
    }, [ navigatorData ])

    if (!navigatorData.enteredGuestRoom) return null

    return (
        <NitroCardView uniqueKey="room-info" className="illumina-room-info w-[290px]">
            <NitroCardHeaderView headerText={navigatorData.enteredGuestRoom.roomName} onCloseClick={() => processAction("close")} />
            <NitroCardContentView>
                {navigatorData.enteredGuestRoom.description.length > 0 && <p className="mb-5 text-sm">{navigatorData.enteredGuestRoom.description}</p>}
                <div className="mb-3.5 flex gap-2">
                    <LayoutRoomThumbnailView roomId={roomId} customUrl={customUrl} className="rounded-md">
                        {hasPermission("settings") && <button className="absolute bottom-1 right-1 cursor-pointer" onClick={() => processAction("open_room_thumbnail_camera")}>
                            <i className="block h-[15px] w-[17px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-209px_-253px]" />
                        </button>}
                    </LayoutRoomThumbnailView>
                    <div className="flex flex-1 flex-col gap-1">
                        {navigatorData.enteredGuestRoom.showOwner && <p className="text-sm" onClick={event => GetUserProfile(navigatorData.enteredGuestRoom.ownerId)}>{LocalizeText("navigator.roomownercaption")} {navigatorData.enteredGuestRoom.ownerName}</p>}
                        <p className="text-sm">{LocalizeText("navigator.roomrating")} {navigatorData.currentRoomRating}</p>
                        {(navigatorData.enteredGuestRoom.tags.length > 0) &&
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {navigatorData.enteredGuestRoom.tags.map(tag => <p key={tag} className="cursor-pointer text-sm opacity-50" onClick={event => processAction("navigator_search_tag", tag)}>#{tag}</p>)}
                            </div>}
                    </div>
                    <div className="flex">
                        <i className={`block h-3.5 w-[19px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${navigatorData.homeRoomId === navigatorData.enteredGuestRoom.roomId ? "bg-[-258px_-102px]" : "bg-[-278px_-102px]"}`} onClick={() => processAction("set_home_room")} />
                    </div>
                </div>
                {(navigatorData.enteredGuestRoom.habboGroupId > 0) &&
                    <div className="mb-3 flex gap-2 px-2.5" onClick={() => processAction("open_group_info")}>
                        <LayoutBadgeImageView className="flex-none" badgeCode={navigatorData.enteredGuestRoom.groupBadgeCode} isGroup={true} />
                        <p className="text-sm underline">
                            {LocalizeText("navigator.guildbase", [ "groupName" ], [ navigatorData.enteredGuestRoom.groupName ])}
                        </p>
                    </div>}
                <div className="flex w-full flex-col gap-1">
                    {hasPermission("staff_pick") &&
                        <Button onClick={() => processAction("toggle_pick")}>
                            {LocalizeText(isRoomPicked ? "navigator.staffpicks.unpick" : "navigator.staffpicks.pick")}
                        </Button>}
                    {hasPermission("settings") &&
                        <>
                            <Button onClick={() => processAction("open_room_settings")}>
                                {LocalizeText("navigator.room.popup.info.room.settings")}
                            </Button>
                            <Button onClick={() => processAction("room_filter")}>
                                {LocalizeText("navigator.roomsettings.roomfilter")}
                            </Button>
                            <Button onClick={() => processAction("open_floorplan_editor")}>
                                {LocalizeText("open.floor.plan.editor")}
                            </Button>
                        </>}
                    <Button className="mx-2.5 my-3 !h-8 gap-[9px]" onClick={() => processAction("report_room")}>
                        <i className="block size-[19px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-227px_-252px]" />
                        <div className="h-5 w-0.5 border-r border-[#ECECEC] bg-[#919191] dark:border-[#36322C] dark:bg-black" />
                        <p className="text-sm">{LocalizeText("help.emergency.main.report.room")}</p>
                    </Button>
                    {hasPermission("settings") &&
                        <Button onClick={() => processAction("toggle_mute")}>
                            {LocalizeText(isRoomMuted ? "navigator.muteall_on" : "navigator.muteall_off")}
                        </Button>}
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
