import { FC, useMemo } from "react"
import { LocalizeText } from "../../api"
import { BaseProps } from "../Base"

interface LayoutCounterTimeViewProps extends BaseProps<HTMLDivElement>
{
    day: string;
    hour: string;
    minutes: string;
    seconds: string;
}

export const LayoutCounterTimeView: FC<LayoutCounterTimeViewProps> = props =>
{
    const { day = "00", hour = "00", minutes = "00", seconds = "00", classNames = [], className = "", children = null, ...rest } = props

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ "flex" ]

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
            <div className="flex flex-col gap-0.5">
                <div className="flex h-[23px] w-[27px] items-center justify-center bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-83px_-118px]">
                    <p className="text-whit [text-shadow:_0_1px_0_#33312B]e text-sm font-semibold !leading-3">{ day !== "00" ? day : hour }</p>
                </div>
                <p className="text-center text-xs">{ day !== "00" ? LocalizeText("countdown_clock_unit_days") : LocalizeText("countdown_clock_unit_hours") }</p>
            </div>
            <div className="mx-[3px] mt-[5px] text-base font-semibold !leading-3">:</div>
            <div className="flex flex-col gap-0.5">
                <div className="flex h-[23px] w-[27px] items-center justify-center bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-83px_-118px]">
                    <p className="text-whit [text-shadow:_0_1px_0_#33312B]e text-sm font-semibold !leading-3">{ minutes }</p>
                </div>
                <p className="text-center text-xs">{ LocalizeText("countdown_clock_unit_minutes") }</p>
            </div>
            <div className="mx-[3px] mt-[5px] text-base font-semibold !leading-3">:</div>
            <div className="flex flex-col gap-0.5">
                <div className="flex h-[23px] w-[27px] items-center justify-center bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-83px_-118px]">
                    <p className="text-sm font-semibold !leading-3 text-white [text-shadow:_0_1px_0_#33312B]">{ seconds }</p>
                </div>
                <p className="text-center text-xs">{ LocalizeText("countdown_clock_unit_seconds") }</p>
            </div>
            { children }
        </div>
    )
}
