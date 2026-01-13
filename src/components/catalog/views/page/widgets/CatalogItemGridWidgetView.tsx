import { FC, ReactNode, useEffect, useMemo, useRef } from "react"
import { IPurchasableOffer, ProductTypeEnum } from "../../../../../api"
import { useCatalog } from "../../../../../hooks"
import { CatalogGridOfferView } from "../common/CatalogGridOfferView"

interface CatalogItemGridWidgetViewProps
{
    classNames?: string[];
    className?: string;
    children?: ReactNode;
}

export const CatalogItemGridWidgetView: FC<CatalogItemGridWidgetViewProps> = props =>
{
    const { children = null, classNames = [], className = "", ...rest } = props
    const { currentOffer = null, setCurrentOffer = null, currentPage = null, setPurchaseOptions = null } = useCatalog()
    const elementRef = useRef<HTMLDivElement>()

    const getClassNames = useMemo(() => {
        const newClassNames: string[] = [ "grid grid-rows-[max-content] grid-cols-6 gap-[3px] h-full [place-content:flex-start] illumina-scrollbar" ]

        if (classNames.length) newClassNames.push(...classNames)

        return newClassNames
    }, [ classNames ])

    const getClassName = useMemo(() => {
        let newClassName = getClassNames.join(" ")

        if (className.length) newClassName += (" " + className)

        return newClassName.trim()
    }, [ getClassNames, className ])

    const selectOffer = (offer: IPurchasableOffer) =>
    {
        offer.activate()

        if(offer.isLazy) return
        
        setCurrentOffer(offer)

        if(offer.product && (offer.product.productType === ProductTypeEnum.WALL))
        {
            setPurchaseOptions(prevValue =>
            {
                const newValue = { ...prevValue }
    
                newValue.extraData = (offer.product.extraParam || null)
    
                return newValue
            })
        }
    }

    useEffect(() =>
    {
        if(elementRef && elementRef.current) elementRef.current.scrollTop = 0
    }, [ currentPage ])

    if(!currentPage) return null

    return (
        <div className={ getClassName } ref={ elementRef } { ...rest }>
            { currentPage.offers && (currentPage.offers.length > 0) && currentPage.offers.map((offer, index) => <CatalogGridOfferView key={ index } itemActive={ (currentOffer && (currentOffer.offerId === offer.offerId)) } offer={ offer } selectOffer={ selectOffer } />) }
            { children }
        </div>
    )
}
