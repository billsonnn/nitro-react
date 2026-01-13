import { FC } from "react"
import { NotificationBubbleItem, OpenUrl } from "../../../../api"
import { LayoutNotificationBubbleView, LayoutNotificationBubbleViewProps } from "../../../../common"

export interface NotificationDefaultBubbleViewProps extends LayoutNotificationBubbleViewProps
{
    item: NotificationBubbleItem;
}

export const NotificationDefaultBubbleView: FC<NotificationDefaultBubbleViewProps> = props =>
{
    const { item = null, onClose = null, ...rest } = props
    
    const htmlText = item.message.replace(/\r\n|\r|\n/g, "<br />")

    return (
        <LayoutNotificationBubbleView onClose={ onClose } onClick={ event => (item.linkUrl && item.linkUrl.length && OpenUrl(item.linkUrl)) } { ...rest }>
            <i className="mt-[7px] block size-[50px] bg-center bg-no-repeat" style={{ backgroundImage: `url(${item.iconUrl})` }} />
            <p className="font-volter_bold text-[8px] !leading-[9px] text-white" dangerouslySetInnerHTML={ { __html: htmlText } } />
        </LayoutNotificationBubbleView>
    )
}
