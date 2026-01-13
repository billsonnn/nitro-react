import { FC, useMemo } from "react"
import { FlexProps } from "../.."

export const NitroCardTabsView: FC<FlexProps> = props =>
{
    const { classNames = [], className = "", children = null, ...rest } = props

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ "flex justify-center items-end px-2.5 gap-1" ]

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
            { children }
        </div>
    )
}
