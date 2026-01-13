import { FC, useMemo, useRef } from "react"
import { ColumnProps } from ".."
import { DraggableWindow, DraggableWindowPosition, DraggableWindowProps } from "../draggable-window"

export interface NitroCardViewProps extends DraggableWindowProps, ColumnProps
{
    customZIndex?: number;
}

export const NitroCardView: FC<NitroCardViewProps> = props =>
{
    const { uniqueKey = null, handleSelector = ".drag-handler", windowPosition = DraggableWindowPosition.CENTER, disableDrag = false, customZIndex = 0, classNames = [], className = "", ...rest } = props
    const elementRef = useRef<HTMLDivElement>()

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ "illumina-card flex flex-col drop-shadow-[4px_4px_4px_#00000017]" ]

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
        <DraggableWindow uniqueKey={ uniqueKey } handleSelector={ handleSelector } windowPosition={ windowPosition } disableDrag={ false } customZIndex={ customZIndex }>
            <div ref={ elementRef } className={ getClassName } { ...rest } />
        </DraggableWindow>
    )
}
