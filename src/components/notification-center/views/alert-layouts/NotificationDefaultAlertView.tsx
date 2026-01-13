import { FC, useState } from "react"
import { LocalizeText, NotificationAlertItem, NotificationAlertType, OpenUrl } from "../../../../api"
import { Button, LayoutNotificationAlertView, LayoutNotificationAlertViewProps } from "../../../../common"

interface NotificationDefaultAlertViewProps extends LayoutNotificationAlertViewProps
{
    item: NotificationAlertItem;
}

export const NotificationDefaultAlertView: FC<NotificationDefaultAlertViewProps> = props =>
{
    const { item = null, title = ((props.item && props.item.title) || ""), onClose = null, ...rest } = props
    const [ imageFailed, setImageFailed ] = useState<boolean>(false)

    const visitUrl = () =>
    {
        OpenUrl(item.clickUrl)
        
        onClose()
    }
    
    const hasFrank = (item.alertType === NotificationAlertType.DEFAULT)

    const widthAndHeight = (type: string) =>
    {
        switch(type)
        {
        case NotificationAlertType.DEFAULT:
            return "w-[352px] h-[210px]"
        default:
            return "w-[278px] h-auto"
        }
    }

    return (
        <LayoutNotificationAlertView className={widthAndHeight(item.alertType)} title={ title } onClose={ onClose } { ...rest } type={ NotificationAlertType.DEFAULT }>
            <div className="flex gap-[13px] overflow-hidden">
                { hasFrank && !item.imageUrl && <i className="block h-[87px] w-8 bg-[url('/client-assets/images/notifications/frank-alert.png?v=2451779')] dark:bg-[url('/client-assets/images/notifications/frank-alert-dark.png?v=2451779')]" /> }
                {/* { item.imageUrl && !imageFailed && <img src={ item.imageUrl } alt={ item.title } onError={ () => { setImageFailed(true) } } className="self-baseline" /> } */}
                <div className="w-full flex-1">
                    <div className={`illumina-scrollbar mb-2.5 min-h-[73px] break-words text-[13px] ${hasFrank && !item.imageUrl ? "max-h-[100px]" : "max-h-[270px]"}`}>
                        { (item.messages.length > 0) && item.messages.map((message, index) => {
                            const htmlText = message.replace(/\r\n|\r|\n/g, "<div class='mt-[5px] italic' />")

                            return <p key={ index } dangerouslySetInnerHTML={ { __html: htmlText } } />
                        })}
                    </div>
                    { item.clickUrl && (item.clickUrl.length > 0) && (item.imageUrl && !imageFailed) && <>
                        <div className="flex flex-col items-center px-[43px]">
                            <div className="mb-[11px] mt-6 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                            <Button onClick={ visitUrl } className="self-center px-3">{ LocalizeText("inventory.furni.gotoroom") }</Button>
                        </div>
                    </> }
                </div>
            </div>
            { (!item.imageUrl || (item.imageUrl && imageFailed)) && <>
                <div className="flex flex-col items-center px-[43px]">
                    { item.alertType === NotificationAlertType.DEFAULT && <div className="mb-[11px] mt-6 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" /> }
                    { !item.clickUrl && <Button className="!h-[26px]" onClick={ onClose }>{ LocalizeText("generic.ok") }</Button> }
                    { item.clickUrl && (item.clickUrl.length > 0) && <Button onClick={ visitUrl }>{ LocalizeText(item.clickUrlText) }</Button> }
                </div>
            </> }
        </LayoutNotificationAlertView>
    )

}
