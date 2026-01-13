import { FC, MouseEvent, useMemo } from "react"
import { FlexProps } from "../../../../common"

interface ContextMenuListItemViewProps extends FlexProps
{
    disabled?: boolean;
}

export const ContextMenuListItemView: FC<ContextMenuListItemViewProps> = props =>
{
    const { disabled = false, classNames = [], className = "", onClick = null, ...rest } = props

    const handleClick = (event: MouseEvent<HTMLDivElement>) =>
    {
        if(disabled) return

        if(onClick) onClick(event)
    }

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ "flex items-center justify-between list-style-none text-xs text-dark [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B] font-semibold !leading-3 mb-[11px] cursor-pointer" ]

        if(disabled) newClassNames.push("text-[#636363] dark:text-[#737067] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B] !cursor-default")

        if(classNames.length) newClassNames.push(...classNames)

        return newClassNames
    }, [ disabled, classNames ])

    const getClassName = useMemo(() =>
    {
        let newClassName = getClassNames.join(" ")

        if(className.length) newClassName += (" " + className)

        return newClassName.trim()
    }, [ getClassNames, className ])

    return <div className={ getClassName } onClick={ handleClick } { ...rest } />
}
