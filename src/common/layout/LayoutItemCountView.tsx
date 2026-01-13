import { FC, useMemo } from "react"
import { BaseProps } from ".."

interface LayoutItemCountViewProps extends BaseProps<HTMLDivElement>
{
    count: number;
}

export const LayoutItemCountView: FC<LayoutItemCountViewProps> = props =>
{
    const { count = 0, classNames = [], className = "", children = null, ...rest } = props

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ "illumina-item-badge absolute -top-1.5 -right-1.5 px-1.5 text-[11px] font-semibold [text-shadow:_0_1px_0_#ec2822] not-italic text-white z-30" ]

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
            { count }
            { children }
        </div>
    )
}
