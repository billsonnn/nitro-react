import { FC } from "react"
import { GetIlluminaVersion, GetRendererVersion, GetUIVersion, NotificationAlertItem } from "../../../../api"
import { Button, LayoutNotificationAlertView, LayoutNotificationAlertViewProps } from "../../../../common"

interface NotificationDefaultAlertViewProps extends LayoutNotificationAlertViewProps
{
    item: NotificationAlertItem;
}

export const NitroSystemAlertView: FC<NotificationDefaultAlertViewProps> = props =>
{
    const { title = "Nitro with Illumina UI", onClose = null, ...rest } = props

    return (
        <LayoutNotificationAlertView title={ title } onClose={ onClose } { ...rest }>
            <div className="flex gap-3">
                <object data="https://assets.nitrodev.co/logos/nitro-n-dark.svg" width="100" height="100">&nbsp;</object>
                <div className="pr-3">
                    <p className="mb-1.5 text-center font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Nitro React with Illumina UI</p>
                    <p className="text-sm"><b className="font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Nitro:</b> v{ GetUIVersion() }</p>
                    <p className="text-sm"><b className="font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Illumina:</b> v{ GetIlluminaVersion() }</p>
                    <p className="text-sm"><b className="font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Renderer:</b> v{ GetRendererVersion() }</p>
                    <div className="mt-4 flex w-full flex-col gap-2">
                        <Button variant="success" className="w-full" onClick={ event => window.open("https://discord.gg/yMRWuSekS8") }>Discord</Button>
                    </div>
                </div>
            </div>
        </LayoutNotificationAlertView>
    )
}
