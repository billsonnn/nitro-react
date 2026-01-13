import { FC } from "react"
import { NotificationBubbleItem } from "../../../../api"
import { LayoutNotificationBubbleViewProps } from "../../../../common"

export interface NotificationClubGiftBubbleViewProps extends LayoutNotificationBubbleViewProps
{
    item: NotificationBubbleItem;
}

export const NotificationClubGiftBubbleView: FC<NotificationClubGiftBubbleViewProps> = props =>
{
    const { item = null, onClose = null, ...rest } = props

    return null
}
