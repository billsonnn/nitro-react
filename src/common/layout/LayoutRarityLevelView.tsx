import { FC, useMemo } from "react"
import { BaseProps } from ".."

interface LayoutRarityLevelViewProps extends BaseProps<HTMLDivElement>
{
    level: number;
}

export const LayoutRarityLevelView: FC<LayoutRarityLevelViewProps> = props =>
{
    const { level = 0, classNames = [], className = "", children = null, ...rest } = props

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ "bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-354px_-143px] w-9 h-7 flex items-center justify-center z-10" ]

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
            <p className="text-sm font-semibold !text-black [text-shadow:_0_1px_0_#d1dacb]">{ level }</p>
            { children }
        </div>
    )
}
