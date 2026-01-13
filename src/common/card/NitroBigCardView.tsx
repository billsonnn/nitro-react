import { FC, useMemo, useRef } from "react"
import { ColumnProps } from ".."
import { GetConfiguration } from "../../api"
import { DraggableWindowProps } from "../draggable-window"

export interface NitroBigCardViewProps extends DraggableWindowProps, ColumnProps
{
    onCloseClick?: () => void;
}

export const NitroBigCardView: FC<NitroBigCardViewProps> = props =>
{
    const { uniqueKey = null, onCloseClick = null, classNames = [], className = "", ...rest } = props
    const elementRef = useRef<HTMLDivElement>()

    const isOverlayRadial: boolean = GetConfiguration<boolean>("illumina.overlay.radial")

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ "relative z-[9999]" ]

        if(classNames.length) newClassNames.push(...classNames)

        return newClassNames
    }, [ classNames ])

    const getClassName = useMemo(() =>
    {
        let newClassName = getClassNames.join(" ")

        if(className.length) newClassName += (" " + className)

        return newClassName.trim()
    }, [ getClassNames, className ])

    return (
        <div>
            <div className="absolute left-0 top-0 z-[450] flex size-full items-center justify-center">
                <div ref={ elementRef } className={ getClassName } { ...rest } />
                <div className={`absolute left-0 top-0 z-[999] flex size-full items-center justify-center ${isOverlayRadial ? "bg-[radial-gradient(circle_at_50%_50%,#191714,#1917143d)]" : "bg-black/75"}`} onClick={ onCloseClick } />
            </div>
        </div>
    )
}
