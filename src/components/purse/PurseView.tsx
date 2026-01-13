import { FriendlyTime, HabboClubLevelEnum } from "@nitrots/nitro-renderer"
import { FC, useMemo } from "react"
import { CreateLinkEvent, GetConfiguration, LocalizeText } from "../../api"
import { usePurse } from "../../hooks"
import { CurrencyView } from "./views/CurrencyView"

export const PurseView: FC<{}> = props =>
{
    const { purse = null, hcDisabled = false, helpAndSettingsDisabled = false } = usePurse()

    const displayedCurrencies = useMemo(() => GetConfiguration<number[]>("system.currency.types", []), [])
    const currencyDisplayNumberShort = useMemo(() => GetConfiguration<boolean>("currency.display.number.short", false), [])
    const hidePurse: boolean = GetConfiguration<boolean>("illumina.hide.purse")

    const getClubText = (() =>
    {
        if(!purse) return null

        const totalDays = ((purse.clubPeriods * 31) + purse.clubDays)
        const minutesUntilExpiration = purse.minutesUntilExpiration

        if(purse.clubLevel === HabboClubLevelEnum.NO_CLUB) return LocalizeText("purse.clubdays.zero.amount.text")

        else if((minutesUntilExpiration > -1) && (minutesUntilExpiration < (60 * 24))) return FriendlyTime.shortFormat(minutesUntilExpiration * 60)
        
        else return FriendlyTime.shortFormat(totalDays * 86400)
    })()

    const getCurrencyElements = (offset: number, limit: number = -1, seasonal: boolean = false) =>
    {
        if(!purse || !purse.activityPoints || !purse.activityPoints.size) return null

        const types = Array.from(purse.activityPoints.keys()).filter(type => (displayedCurrencies.indexOf(type) >= 0))

        let count = 0

        while(count < offset)
        {
            types.shift()

            count++
        }

        count = 0

        const elements: JSX.Element[] = []

        for(const type of types)
        {
            if((limit > -1) && (count === limit)) break

            elements.push(<CurrencyView key={ type } type={ type } amount={ purse.activityPoints.get(type) } short={ currencyDisplayNumberShort } />)

            count++
        }

        return elements
    }

    if(!purse) return null

    return (
        <div className="h-[35px]">
            <div className="flex h-full gap-1.5">
                { !hidePurse &&
                    <div className="illumina-purse flex gap-[3px] px-3 py-[9px]">
                        <CurrencyView type={ -1 } amount={ purse.credits } short={ currencyDisplayNumberShort } />
                        { getCurrencyElements(0, 2) }
                        { getCurrencyElements(2, -1, true) }
                    </div> }
                { !hcDisabled &&
                    <div className="illumina-purse flex h-full gap-[3px] px-3 py-[9px]">
                        <div className="flex cursor-pointer gap-1 hover:brightness-125 active:translate-x-0 active:translate-y-0 active:brightness-90" onClick={ event => CreateLinkEvent("habboUI/open/hccenter") }>
                            <i className="illumina-currency club" />
                            <p className="text-xs font-semibold text-[#F3F3F3] [text-shadow:_0_-1px_0_#000]">{ getClubText }</p>
                        </div>
                    </div> }
                { !helpAndSettingsDisabled &&
                    <div className="illumina-purse flex h-full items-center gap-[3px] px-3 py-1.5">
                        <div className="flex cursor-pointer gap-1 hover:brightness-125 active:translate-x-0 active:translate-y-0 active:brightness-90" onClick={ event => CreateLinkEvent("help/show") }>
                            <i className="size-[15px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-235px_-278px]" />
                        </div>
                        <div className="mx-[7px] block h-[17px] w-0.5 border-r border-[#3E3931] bg-black" />
                        <div className="flex cursor-pointer gap-1 hover:brightness-125 active:translate-x-0 active:translate-y-0 active:brightness-90" onClick={ event => CreateLinkEvent("user-settings/toggle") }>
                            <i className="h-[15px] w-3.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-391px_-160px]" />
                        </div>
                    </div> }
            </div>
        </div>
    )
}
