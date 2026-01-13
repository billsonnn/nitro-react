import { FC, useMemo } from "react"
import { FlexProps } from "../../Flex"
import { LayoutItemCountView } from "../../layout"

interface NitroCardTabsItemViewProps extends FlexProps
{
    isActive?: boolean;
    count?: number;
}

export const NitroCardTabsItemView: FC<NitroCardTabsItemViewProps> = props =>
{
    const { isActive = false, count = 0, classNames = [], className = "", children = null, ...rest } = props

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ "illumina-tab-item illumina-btn-primary flex justify-center items-center relative cursor-pointer h-[27px] px-3 text-[13px] !font-normal" ]

        if(isActive) newClassNames.push("active")

        if(classNames.length) newClassNames.push(...classNames)

        return newClassNames
    }, [ isActive, classNames ])

    const getClassName = useMemo(() =>
    {
        let newClassName = getClassNames.join(" ")

        if(className.length) newClassName += (" " + className)

        return newClassName.trim()
    }, [ getClassNames, className ])

    return (
        <div className={ getClassName } { ...rest }>
            <div className="flex items-center justify-center">
                { children }
            </div>
            { (count > 0) && <LayoutItemCountView count={ count } className="-right-0.5 -top-0.5 text-[10px]" /> }
        </div>
    )
}
