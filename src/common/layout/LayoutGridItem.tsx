import { FC, useMemo } from "react"
import { ColumnProps } from "../Column"
import { LayoutLimitedEditionStyledNumberView } from "./limited-edition"

export interface LayoutGridItemProps extends ColumnProps
{
    itemImage?: string;
    itemBundle?: boolean;
    itemAbsolute?: boolean;
    itemColor?: string;
    itemActive?: boolean;
    itemCount?: number;
    itemCountMinimum?: number;
    itemUniqueSoldout?: boolean;
    itemUniqueNumber?: number;
    itemUnseen?: boolean;
    itemHighlight?: boolean;
    disabled?: boolean;
}

export const LayoutGridItem: FC<LayoutGridItemProps> = props =>
{
    const { itemImage = undefined, itemBundle = false, itemAbsolute = false, itemColor = undefined, itemActive = false, itemCount = 1, itemCountMinimum = 1, itemUniqueSoldout = false, itemUniqueNumber = -2, itemUnseen = false, itemHighlight = false, disabled = false, center = true, style = {}, classNames = [], className = "", children = null, ...rest } = props

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ "relative flex items-center justify-center h-[43px] cursor-pointer" ]

        if(!itemBundle) newClassNames.push("illumina-furni-item")

        if(itemActive) newClassNames.push("active")

        if(itemUnseen) newClassNames.push("unseen")

        if(itemHighlight) newClassNames.push("has-highlight")

        if(disabled) newClassNames.push("disabled")

        if(itemImage === null) newClassNames.push("icon", "loading-icon")

        if(classNames.length) newClassNames.push(...classNames)

        return newClassNames
    }, [ itemActive, itemUniqueSoldout, itemUniqueNumber, itemUnseen, itemHighlight, disabled, itemImage, classNames ])

    const getClassName = useMemo(() =>
    {
        let newClassName = getClassNames.join(" flex-col ")

        if(className.length) newClassName += (" " + className)

        return newClassName.trim()
    }, [ getClassNames, className ])

    const getStyle = useMemo(() =>
    {
        let newStyle = { ...style }

        if(itemImage && !(itemUniqueSoldout || (itemUniqueNumber > 0))) newStyle.backgroundImage = `url(${ itemImage })`

        if(itemColor) newStyle.backgroundColor = itemColor

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style }

        return newStyle
    }, [ style, itemImage, itemColor, itemUniqueSoldout, itemUniqueNumber ])

    return (
        <div className={ getClassName } { ...rest }>
            { (itemCount > itemCountMinimum) &&
                <div className="illumina-card-item absolute -right-0.5 -top-0.5 z-30 shrink-0 px-2 py-[3px] text-[11px] font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{itemCount}</div> }
            { (itemUniqueNumber > 0)
                ? <div className={`illumina-unique-item relative z-10 flex w-full items-center justify-center ${itemUniqueSoldout && "sold-out"}`}>
                    <div className="item-opacity z-10 flex h-9 w-full items-center justify-center gap-0 bg-center bg-no-repeat" style={ { backgroundImage: `url(${ itemImage })` } } />
                    <div className="absolute bottom-0 z-20 mx-auto my-0 flex h-[9px] w-9 items-center justify-center bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[0px_-143px]">
                        <LayoutLimitedEditionStyledNumberView value={ itemUniqueNumber } />
                    </div>
                </div> : <div className={`item-opacity z-10 size-full h-9 bg-center bg-no-repeat ${itemAbsolute ? "absolute" : ""}`} style={ getStyle } /> }
            { children }
        </div>
    )
}
