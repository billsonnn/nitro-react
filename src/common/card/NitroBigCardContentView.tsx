import { FC, useMemo } from "react"
import { ColumnProps } from ".."

export const NitroBigCardContentView: FC<ColumnProps> = props =>
{
    const { classNames = [], className = "", ...rest } = props

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ "illumina-card illumina-card-body flex flex-col p-2.5 overflow-hidden" ]

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
