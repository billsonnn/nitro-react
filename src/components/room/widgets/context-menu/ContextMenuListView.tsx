import { FC, useMemo } from "react"
import { ColumnProps } from "../../../../common"

export const ContextMenuListView: FC<ColumnProps> = props =>
{
    const { classNames = [], className = "", ...rest } = props

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ "menu-list" ]

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
