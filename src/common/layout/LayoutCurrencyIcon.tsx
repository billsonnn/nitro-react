import { FC, useMemo } from "react"
import { BaseProps } from "../Base"

export interface CurrencyIconProps extends BaseProps<HTMLDivElement>
{
    type?: string;
    currency: number;
    classNames?: string[];
    className?: string;
}

export const LayoutCurrencyIcon: FC<CurrencyIconProps> = props =>
{
    const { type = "", currency = 0, classNames = [], className = "" } = props

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = []

        newClassNames.push(currency.toString())
        if(type) newClassNames.push(`illumina-currency-${type}`)
        if(!type) newClassNames.push("illumina-currency")
            
        if(currency === -1) newClassNames.push("credits")
        if(currency === 0) newClassNames.push("duckets")
        if(currency === 5) newClassNames.push("diamonds")
        if((currency !== -1) && (currency !== 0) && (currency !== 5)) newClassNames.push("currency-" + currency.toString())

        if(classNames.length) newClassNames.push(...classNames)

        return newClassNames
    }, [ type, currency, classNames ])

    const getClassName = useMemo(() =>
    {
        let newClassName = getClassNames.join(" ")

        if(className.length) newClassName += (" " + className)

        return newClassName.trim()
    }, [ getClassNames, className ])

    return <i className={ getClassName } />
}
