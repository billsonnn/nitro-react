import { FC, useMemo } from "react"
import { ColumnProps } from ".."

export const NitroCardContentView: FC<ColumnProps> = props =>
{
    const { classNames = [], className = "", ...rest } = props

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ "illumina-card-body flex flex-col px-2.5 pb-2.5 overflow-hidden" ]

        if(classNames.length) newClassNames.push(...classNames)

        return newClassNames
    }, [ classNames ])

    const getClassName = useMemo(() =>
    {
        let newClassName = getClassNames.join(" ")

        if(className.length) newClassName += (" " + className)

        return newClassName.trim()
    }, [ getClassNames, className ])

    return <div className={ getClassName } { ...rest } />
}
