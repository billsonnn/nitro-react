import { FC, useMemo } from "react"
import { BaseProps } from "../../Base"
import { LayoutLimitedEditionStyledNumberView } from "./LayoutLimitedEditionStyledNumberView"

interface LayoutLimitedEditionCompactPlateViewProps extends BaseProps<HTMLDivElement>
{
    uniqueNumber: number;
    uniqueSeries: number;
}

export const LayoutLimitedEditionCompactPlateView: FC<LayoutLimitedEditionCompactPlateViewProps> = props =>
{
    const { uniqueNumber = 0, uniqueSeries = 0, classNames = [], className = "", children = null, ...rest } = props

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ "bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-74px_-143px] w-[34px] h-[37px] flex flex-col justify-end items-center z-10" ]

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
        <div className={ getClassName } { ...rest }>
            <div className="flex h-[9.5px] items-center justify-center">
                <LayoutLimitedEditionStyledNumberView value={ uniqueNumber } />
            </div>
            <div className="flex h-[9.5px] items-center justify-center">
                <LayoutLimitedEditionStyledNumberView value={ uniqueSeries } />
            </div>
            { children }
        </div>
    )
}
