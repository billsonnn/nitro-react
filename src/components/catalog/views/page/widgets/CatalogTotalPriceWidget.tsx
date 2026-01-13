import { FC, useMemo } from "react"
import { LocalizeText, Offer } from "../../../../../api"
import { useCatalog } from "../../../../../hooks"
import { CatalogPriceDisplayWidgetView } from "./CatalogPriceDisplayWidgetView"

export const CatalogTotalPriceWidget: FC = () =>
{
    const { currentOffer = null, purchaseOptions = null } = useCatalog()

    const isLimitedSoldOut = useMemo(() =>
    {
        if(!currentOffer) return false
        
        if(purchaseOptions.extraParamRequired && (!purchaseOptions.extraData || !purchaseOptions.extraData.length)) return false

        if(currentOffer.pricingModel === Offer.PRICING_MODEL_SINGLE)
        {
            const product = currentOffer.product

            if(product && product.isUniqueLimitedItem) return !product.uniqueLimitedItemsLeft
        }

        return false
    }, [ currentOffer, purchaseOptions ])

    if(!currentOffer || isLimitedSoldOut || !currentOffer.bundlePurchaseAllowed) return null

    return (
        <div className="flex w-[152px] items-center justify-between">
            <p className="text-sm text-[#6A6A6A]">{ LocalizeText("catalog.bundlewidget.price") }</p>
            <CatalogPriceDisplayWidgetView offer={ currentOffer } />
        </div>
    )
}
