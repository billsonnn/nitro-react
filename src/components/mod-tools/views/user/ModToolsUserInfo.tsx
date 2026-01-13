import { FriendlyTime, GetModeratorUserInfoMessageComposer, ModeratorUserInfoData, ModeratorUserInfoEvent } from "@nitrots/nitro-renderer"
import { FC, useEffect, useMemo, useState } from "react"
import { CreateLinkEvent, LocalizeText, SendMessageComposer } from "../../../../api"
import { Button } from "../../../../common"
import { useMessageEvent } from "../../../../hooks"
import { ModToolsUserModActionView } from "./ModToolsUserModActionView"
import { ModToolsUserRoomVisitsView } from "./ModToolsUserRoomVisitsView"
import { ModToolsUserSendMessageView } from "./ModToolsUserSendMessageView"

interface ModToolsUserInfoProps
{
    userId: number;
}

export const ModToolsUserInfo: FC<ModToolsUserInfoProps> = props =>
{
    const { userId = null } = props
    const [ userInfo, setUserInfo ] = useState<ModeratorUserInfoData>(null)
    const [ sendMessageVisible, setSendMessageVisible ] = useState(false)
    const [ modActionVisible, setModActionVisible ] = useState(false)
    const [ roomVisitsVisible, setRoomVisitsVisible ] = useState(false)

    const userProperties = useMemo(() =>
    {
        if(!userInfo) return null

        return [
            {
                localeKey: "Name",
                value: userInfo.userName
            },
            {
                localeKey: "CFHs",
                value: userInfo.cfhCount.toString()
            },
            {
                localeKey: "Abusive CFHs",
                value: userInfo.abusiveCfhCount.toString()
            },
            {
                localeKey: "Cautions",
                value: userInfo.cautionCount.toString()
            },
            {
                localeKey: "Bans",
                value: userInfo.banCount.toString()
            },
            {
                localeKey: "Banned Accs",
                value: userInfo.identityRelatedBanCount.toString()
            },
            {
                localeKey: "Registered",
                value: FriendlyTime.format(userInfo.registrationAgeInMinutes * 60, ".ago", 2)
            },
            {
                localeKey: "Last Login",
                value: FriendlyTime.format(userInfo.minutesSinceLastLogin * 60, ".ago", 2)
            },
            {
                localeKey: "Online",
                value: userInfo.online ? "Yes" : "No"
            },
            {
                localeKey: "Rank",
                value: userInfo.userClassification
            }
        ]
    }, [ userInfo ])

    useMessageEvent<ModeratorUserInfoEvent>(ModeratorUserInfoEvent, event =>
    {
        const parser = event.getParser()
    
        if(!parser || parser.data.userId !== userId) return
    
        setUserInfo(parser.data)
    })

    useEffect(() =>
    {
        SendMessageComposer(new GetModeratorUserInfoMessageComposer(userId))
    }, [ userId ])

    if(!userInfo) return null

    return (
        <>
            <div className="illumina-input flex justify-between gap-1.5 p-1.5">
                <div className="flex flex-1 flex-col">
                    { userProperties.map((property, index) => (
                        <div key={ index } className="flex gap-1 px-2 py-1.5 even:bg-[#EEEEEE] dark:even:bg-[#33312B]">
                            <p className="w-[70px] overflow-hidden truncate text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText(property.localeKey) }</p>
                            <p className="cursor-pointer text-[13px] !leading-3">
                                { property.value }
                            </p>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-0.5">
                    <Button onClick={ event => CreateLinkEvent(`mod-tools/open-user-chatlog/${ userId }`) }>
                        Room Chat
                    </Button>
                    <Button onClick={ event => setSendMessageVisible(!sendMessageVisible) }>
                        Send Message
                    </Button>
                    <Button onClick={ event => setRoomVisitsVisible(!roomVisitsVisible) }>
                        Room Visits
                    </Button>
                    <Button onClick={ event => setModActionVisible(!modActionVisible) }>
                        Mod Action
                    </Button>
                </div>
            </div>
            { sendMessageVisible &&
                <ModToolsUserSendMessageView user={ { userId: userId, username: userInfo.userName } } onCloseClick={ () => setSendMessageVisible(false) } /> }
            { modActionVisible &&
                <ModToolsUserModActionView user={ { userId: userId, username: userInfo.userName } } onCloseClick={ () => setModActionVisible(false) } /> }
            { roomVisitsVisible &&
                <ModToolsUserRoomVisitsView userId={ userId } userName={ userInfo.userName } onCloseClick={ () => setRoomVisitsVisible(false) } /> }
        </>
    )
}
