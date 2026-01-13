import { FC } from "react"
import { NotificationAlertType, NotificationConfirmItem } from "../../../../api"
import { Button, LayoutNotificationAlertView, LayoutNotificationAlertViewProps } from "../../../../common"

export interface NotificationDefaultConfirmViewProps extends LayoutNotificationAlertViewProps
{
    item: NotificationConfirmItem;
}

export const NotificationDefaultConfirmView: FC<NotificationDefaultConfirmViewProps> = props =>
{
    const { item = null, onClose = null, ...rest } = props
    const { message = null, onConfirm = null, onCancel = null, confirmText = null, cancelText = null, title = null } = item

    const confirm = () =>
    {
        if(onConfirm) onConfirm()

        onClose()
    }

    const cancel = () =>
    {
        if(onCancel) onCancel()
        
        onClose()
    }

    return (
        <LayoutNotificationAlertView className="w-[278px]" title={ title } onClose={ onClose } { ...rest } type={ NotificationAlertType.DEFAULT }>
            <p className="min-h-[73px] break-words pb-4 text-sm">{ message }</p>
            <div className="flex items-center justify-evenly">
                <Button variant="underline" onClick={ cancel }>{ cancelText }</Button>
                <Button onClick={ confirm }>{ confirmText }</Button>
            </div>
        </LayoutNotificationAlertView>
    )
}
