import { FC } from "react"
import { Offer } from "../../../../../api"
import { BaseProps, LayoutLimitedEditionCompletePlateView } from "../../../../../common"
import { useCatalog } from "../../../../../hooks"

export const CatalogLimitedItemWidgetView: FC<BaseProps<HTMLDivElement>> = () =>
{
    const { currentOffer = null } = useCatalog()

    if(!currentOffer || (currentOffer.pricingModel !== Offer.PRICING_MODEL_SINGLE) || !currentOffer.product.isUniqueLimitedItem) return null
    
    return (
        <LayoutLimitedEditionCompletePlateView className="absolute bottom-1.5 left-1.5" uniqueLimitedItemsLeft={ currentOffer.product.uniqueLimitedItemsLeft } uniqueLimitedSeriesSize={ currentOffer.product.uniqueLimitedItemSeriesSize } />
    )
}
