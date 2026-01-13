import { FriendlyTime, GetModeratorUserInfoMessageComposer, ModeratorUserInfoData, ModeratorUserInfoEvent } from "@nitrots/nitro-renderer"
import { FC, useEffect, useMemo, useState } from "react"
import { SendMessageComposer } from "../../../../api"
import { DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { useMessageEvent } from "../../../../hooks"
import { ModToolsUserInfo } from "./ModToolsUserInfo"

interface ModToolsUserViewProps
{
    userId: number;
    onCloseClick: () => void;
}

export const ModToolsUserView: FC<ModToolsUserViewProps> = props =>
{
    const { onCloseClick = null, userId = null } = props
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
            <NitroCardView uniqueKey="mod-tools-user" className="illumina-mod-tools-user" windowPosition={ DraggableWindowPosition.TOP_LEFT }>
                <NitroCardHeaderView headerText="User Info" onCloseClick={ () => onCloseClick() } />
                <NitroCardContentView>
                    <ModToolsUserInfo userId={ userId } />
                </NitroCardContentView>
            </NitroCardView>
        </>
    )
}
