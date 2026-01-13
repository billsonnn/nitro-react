import { FC, useMemo } from "react"
import { NotificationAlertType } from "../../api"
import { NitroCardContentView, NitroCardHeaderView, NitroCardView, NitroCardViewProps } from "../card"

export interface LayoutNotificationAlertViewProps extends NitroCardViewProps
{
    title?: string;
    type?: string;
    onClose: () => void;
}

export const LayoutNotificationAlertView: FC<LayoutNotificationAlertViewProps> = props =>
{
    const { title = "", onClose = null, classNames = [], children = null, type = NotificationAlertType.DEFAULT, ...rest } = props

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ "illumina-alert" ]

        if(classNames.length) newClassNames.push(...classNames)

        return newClassNames
    }, [ classNames, type ])

    return (
        <NitroCardView uniqueKey="alert" customZIndex={ 510 } disableDrag={ type === NotificationAlertType.ALERT } classNames={ getClassNames } { ...rest }>
            <NitroCardHeaderView headerText={ title } onCloseClick={ onClose } />
            <NitroCardContentView>
                { children }
            </NitroCardContentView>
        </NitroCardView>
    )
}
