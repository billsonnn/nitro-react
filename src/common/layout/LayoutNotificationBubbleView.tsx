import { FC, ReactNode, useEffect, useState } from "react"
import { TransitionAnimation, TransitionAnimationTypes } from "../transitions"

export interface LayoutNotificationBubbleViewProps
{
    fadesOut?: boolean;
    timeoutMs?: number;
    onClick?: any;
    onClose?: () => void;
    children?: ReactNode;
}

export const LayoutNotificationBubbleView: FC<LayoutNotificationBubbleViewProps> = props =>
{
    const { fadesOut = true, timeoutMs = 8000, onClose = null, children = null } = props
    const [ isVisible, setIsVisible ] = useState(false)

    useEffect(() =>
    {
        setIsVisible(true)

        return () => setIsVisible(false)
    }, [])

    useEffect(() =>
    {
        if(!fadesOut) return

        const timeout = setTimeout(() =>
        {
            setIsVisible(false)

            setTimeout(() => onClose(), 300)
        }, timeoutMs)

        return () => clearTimeout(timeout)
    }, [ fadesOut, timeoutMs, onClose ])

    return (
        <TransitionAnimation type={ TransitionAnimationTypes.FADE_IN } inProp={ isVisible } timeout={ 300 }>
            <div className="illumina-notification flex w-[190px] gap-4 p-[10px_5px_14px_7px]" onClick={ onClose }>
                { children }
            </div>
        </TransitionAnimation>
    )
}
