import { FC } from "react"
import { AvatarInfoUser } from "../../../../../api"

interface InfoStandWidgetBotViewProps
{
    avatarInfo: AvatarInfoUser;
    onClose: () => void;
}

export const InfoStandWidgetBotView: FC<InfoStandWidgetBotViewProps> = props =>
{
    const { avatarInfo = null, onClose = null } = props

    if(!avatarInfo) return null

    return (
        <div />
    )
}
