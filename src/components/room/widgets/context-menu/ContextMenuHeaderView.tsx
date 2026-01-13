import { FC, useMemo } from "react"
import { FlexProps } from "../../../../common"

export const ContextMenuHeaderView: FC<FlexProps> = props =>
{
    const { classNames = [], className = "", ...rest } = props

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ "text-[#636363] dark:text-[#737067] text-xs font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" ]

        if(classNames.length) newClassNames.push(...classNames)

        return newClassNames
    }, [ classNames ])

    const getClassName = useMemo(() =>
    {
        let newClassName = getClassNames.join(" ")

        if(className.length) newClassName += (" " + className)

        return newClassName.trim()
    }, [ getClassNames, className ])

    return <>
        <span className={ getClassName } { ...rest } />
        <div className="mb-[13px] mt-1.5 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
    </>
}
