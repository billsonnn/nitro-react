import { FC } from "react"
import { IPurchasableOffer } from "../../../../../api"
import { LayoutCurrencyIcon } from "../../../../../common"
import { useCatalog } from "../../../../../hooks"

interface CatalogPriceDisplayWidgetViewProps
{
    offer: IPurchasableOffer;
}

export const CatalogPriceDisplayWidgetView: FC<CatalogPriceDisplayWidgetViewProps> = props =>
{
    const { offer = null } = props
    const { purchaseOptions = null } = useCatalog()
    const { quantity = 1 } = purchaseOptions
    
    if(!offer) return null

    return (
        <div className="flex items-center">
            { (offer.priceInCredits > 0) &&
                <div className="flex items-center justify-end gap-1">
                    <p className="text-sm font-semibold !leading-3">{ (offer.priceInCredits * quantity) }</p>
                    <LayoutCurrencyIcon type="big" currency={ -1 } />
                </div> }
            { (offer.priceInActivityPoints > 0) && <>
                { (offer.priceInCredits > 0) && (offer.priceInActivityPoints > 0) &&
                    <p className="mx-1 text-sm font-semibold !leading-3">+</p> }
                <div className="flex items-center justify-end gap-1">
                    <p className="text-sm font-semibold !leading-3">{ (offer.priceInActivityPoints * quantity) }</p>
                    <LayoutCurrencyIcon type="big" currency={ offer.activityPointType } />
                </div>
            </> }
        </div>
    )
}
