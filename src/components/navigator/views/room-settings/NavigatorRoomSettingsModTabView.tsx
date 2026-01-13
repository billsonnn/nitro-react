import { BannedUserData, BannedUsersFromRoomEvent, RoomBannedUsersComposer, RoomModerationSettings, RoomUnbanUserComposer } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { IRoomData, LocalizeText, SendMessageComposer } from "../../../../api"
import { Button } from "../../../../common"
import { useMessageEvent } from "../../../../hooks"

interface NavigatorRoomSettingsTabViewProps
{
    roomData: IRoomData;
    handleChange: (field: string, value: string | number | boolean) => void;
}

export const NavigatorRoomSettingsModTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomData = null, handleChange = null } = props
    const [ selectedUserId, setSelectedUserId ] = useState<number>(-1)
    const [ bannedUsers, setBannedUsers ] = useState<BannedUserData[]>([])

    const unBanUser = (userId: number) =>
    {
        setBannedUsers(prevValue =>
        {
            const newValue = [ ...prevValue ]

            const index = newValue.findIndex(value => (value.userId === userId))

            if(index >= 0) newValue.splice(index, 1)

            return newValue
        })

        SendMessageComposer(new RoomUnbanUserComposer(userId, roomData.roomId))

        setSelectedUserId(-1)
    }

    useMessageEvent<BannedUsersFromRoomEvent>(BannedUsersFromRoomEvent, event =>
    {
        const parser = event.getParser()

        if(!roomData || (roomData.roomId !== parser.roomId)) return

        setBannedUsers(parser.bannedUsers)
    })

    useEffect(() =>
    {
        SendMessageComposer(new RoomBannedUsersComposer(roomData.roomId))
    }, [ roomData.roomId ])

    return (
        <div className="mt-2 flex flex-col gap-[15px]">
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("navigator.roomsettings.moderation.mute.header") }</p>
                    <div className="illumina-select relative flex h-6 items-center gap-[3px] px-2.5">
                        <select className="w-full bg-transparent text-sm" value={ roomData.moderationSettings.allowMute } onChange={ event => handleChange("moderation_mute", event.target.value) }>
                            <option className="!text-black" value={ RoomModerationSettings.MODERATION_LEVEL_NONE }>
                                { LocalizeText("navigator.roomsettings.moderation.none") }
                            </option>
                            <option className="!text-black" value={ RoomModerationSettings.MODERATION_LEVEL_USER_WITH_RIGHTS }>
                                { LocalizeText("navigator.roomsettings.moderation.rights") }
                            </option>
                        </select>
                        <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("navigator.roomsettings.moderation.kick.header") }</p>
                    <div className="illumina-select relative flex h-6 items-center gap-[3px] px-2.5">
                        <select className="w-full bg-transparent text-sm" value={ roomData.moderationSettings.allowKick } onChange={ event => handleChange("moderation_kick", event.target.value) }>
                            <option className="!text-black" value={ RoomModerationSettings.MODERATION_LEVEL_NONE }>
                                { LocalizeText("navigator.roomsettings.moderation.none") }
                            </option>
                            <option className="!text-black" value={ RoomModerationSettings.MODERATION_LEVEL_USER_WITH_RIGHTS }>
                                { LocalizeText("navigator.roomsettings.moderation.rights") }
                            </option>
                            <option className="!text-black" value={ RoomModerationSettings.MODERATION_LEVEL_ALL }>
                                { LocalizeText("navigator.roomsettings.moderation.all") }
                            </option>
                        </select>
                        <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("navigator.roomsettings.moderation.ban.header") }</p>
                    <div className="illumina-select relative flex h-6 items-center gap-[3px] px-2.5">
                        <select className="w-full bg-transparent text-sm" value={ roomData.moderationSettings.allowBan } onChange={ event => handleChange("moderation_ban", event.target.value) }>
                            <option className="!text-black" value={ RoomModerationSettings.MODERATION_LEVEL_NONE }>
                                { LocalizeText("navigator.roomsettings.moderation.none") }
                            </option>
                            <option className="!text-black" value={ RoomModerationSettings.MODERATION_LEVEL_USER_WITH_RIGHTS }>
                                { LocalizeText("navigator.roomsettings.moderation.rights") }
                            </option>
                        </select>
                        <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2.5">
                <div className="illumina-input h-[156px] w-[172px] p-1">
                    <div className="illumina-scrollbar h-[145px]">
                        { bannedUsers && (bannedUsers.length > 0) && bannedUsers.map((user, index) => (
                            <div key={ index } className="cursor-pointer overflow-hidden p-1 odd:bg-[#EEEEEE] dark:odd:bg-[#27251F]">
                                <p className="text-sm" onClick={ event => setSelectedUserId(user.userId) }> { user.userName }</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <p className="mb-3 text-sm">{ LocalizeText("navigator.roomsettings.moderation.banned.users") } ({ bannedUsers.length })</p>
                    <Button onClick={ event => unBanUser(selectedUserId) }>
                        { LocalizeText("navigator.roomsettings.moderation.unban") } { selectedUserId > 0 && bannedUsers.find(user => (user.userId === selectedUserId))?.userName }
                    </Button>
                </div>
            </div>
        </div>
    )
}
