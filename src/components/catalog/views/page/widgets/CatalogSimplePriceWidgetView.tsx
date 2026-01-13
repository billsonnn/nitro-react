import { FC, useMemo } from "react"
import { useCatalog } from "../../../../../hooks"
import { CatalogPriceDisplayWidgetView } from "./CatalogPriceDisplayWidgetView"

interface CatalogSimplePriceWidgetViewProps
{
    classNames?: string[];
    className: string; 
}

export const CatalogSimplePriceWidgetView: FC<CatalogSimplePriceWidgetViewProps> = props =>
{
    const { classNames = [], className = "" } = props
    const { currentOffer = null, purchaseOptions = null } = useCatalog()
    const { quantity = 1 } = purchaseOptions
    
    const getClassNames = useMemo(() => {
        const newClassNames: string[] = [ "flex justify-center items-center h-[26px] px-4 text-xs cursor-pointer" ]

        if (classNames.length) newClassNames.push(...classNames)

        return newClassNames
    }, [ classNames ])

    const getClassName = useMemo(() => {
        let newClassName = getClassNames.join(" ")

        if (className.length) newClassName += (" " + className)

        return newClassName.trim()
    }, [ getClassNames, className ])

    const getCurrencyName = () =>
    {
        let currencyName = ""
        
        if((currentOffer?.priceInCredits > 0) && (currentOffer?.priceInActivityPoints === 0))
        {
            currencyName = "illumina-catalogue-currency-credits"
        }
        else if((currentOffer?.priceInCredits === 0) && (currentOffer?.priceInActivityPoints > 0) && (currentOffer.activityPointType === 5))
        {
            currencyName = "illumina-catalogue-currency-diamonds"
        } 
        else if((currentOffer?.priceInCredits === 0) && (currentOffer?.priceInActivityPoints > 0) && (currentOffer.activityPointType === 0))
        {
            currencyName = "illumina-catalogue-currency-duckets"
        }
        else
        {
            currencyName = "illumina-catalogue-currency"
        }
        
        return currencyName
    }

    return (
        <div className={ getClassName }>
            <div className={`pb-[3px] pl-1.5 pr-[3px] pt-[5px] text-black ${getCurrencyName()}`}>
                <CatalogPriceDisplayWidgetView offer={ currentOffer } />
            </div>
        </div>
    )
}
