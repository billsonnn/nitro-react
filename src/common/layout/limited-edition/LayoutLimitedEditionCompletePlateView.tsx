import { FC, useMemo } from "react"
import { LocalizeText } from "../../../api"
import { BaseProps } from "../../Base"

interface LayoutLimitedEditionCompletePlateViewProps extends BaseProps<HTMLDivElement>
{
    uniqueLimitedItemsLeft: number;
    uniqueLimitedSeriesSize: number;
}

export const LayoutLimitedEditionCompletePlateView: FC<LayoutLimitedEditionCompletePlateViewProps> = props =>
{
    const { uniqueLimitedItemsLeft = 0, uniqueLimitedSeriesSize = 0, classNames = [], className = "", ...rest } = props

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ "bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-146px_-142px] w-[170px] h-[29px]" ]

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
            <div className="ml-10 flex size-full max-w-[110px] flex-col pt-0.5">
                <div className="flex w-full items-center justify-between">
                    <p className="text-[10px] !leading-3">{ LocalizeText("unique.items.left") }</p>
                    <p className="text-[13px] font-semibold !leading-3">{ uniqueLimitedItemsLeft }</p>
                </div>
                <div className="flex w-full items-center justify-between pt-0.5">
                    <p className="text-[10px] !leading-3">{ LocalizeText("unique.items.number.sold") }</p>
                    <p className="text-[10px] !leading-3">{ uniqueLimitedSeriesSize }</p>
                </div>
            </div>
        </div>
    )
}
