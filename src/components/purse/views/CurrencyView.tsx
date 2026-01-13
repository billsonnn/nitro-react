import { FC, useMemo } from "react"
import { CreateLinkEvent, LocalizeFormattedNumber, LocalizeShortNumber } from "../../../api"
import { LayoutCurrencyIcon } from "../../../common"

interface CurrencyViewProps
{
    type: number;
    amount: number;
    short: boolean;
}

export const CurrencyView: FC<CurrencyViewProps> = props =>
{
    const { type = -1, amount = -1, short = false } = props

    const element = useMemo(() =>
    {
        return (<>
            <div className="flex cursor-pointer gap-1 hover:brightness-125 active:translate-x-0 active:translate-y-0 active:brightness-90" onClick={ event => CreateLinkEvent("catalog/toggle") }>
                <LayoutCurrencyIcon currency={ type } />
                <p className="text-xs font-semibold text-[#F3F3F3] [text-shadow:_0_-1px_0_#000]">{ short ? LocalizeShortNumber(amount) : LocalizeFormattedNumber(amount) }</p>
            </div>
            <div className="mx-[7px] block h-[17px] w-0.5 border-r border-[#3E3931] bg-black last:hidden" />
        </>)
    }, [ amount, short, type ])

    if(!short) return element
}
