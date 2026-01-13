import { FC } from "react"
import { IPurchasableOffer } from "../../../../../api"
import { LayoutCurrencyIcon } from "../../../../../common"
interface CatalogPriceGridDisplayWidgetViewProps
{
    offer: IPurchasableOffer;
}

export const CatalogPriceGridDisplayWidgetView: FC<CatalogPriceGridDisplayWidgetViewProps> = props =>
{
    const { offer = null } = props

    if(!offer) return null

    return (
        <>
            { (offer.priceInCredits > 0) &&
                <div className="flex items-center justify-end gap-1">
                    <p className="truncate text-clip text-xs !leading-3">{ (offer.priceInCredits) }</p>
                    <LayoutCurrencyIcon type="small" currency={ -1 } />
                </div>
            }
            { (offer.priceInActivityPoints > 0) &&
                <div className="flex items-end justify-end gap-1">
                    { (offer.priceInCredits > 0) && (offer.priceInActivityPoints > 0) && <p className="text-xs !leading-3">+</p> }
                    <p className="truncate text-clip text-xs !leading-3">{ (offer.priceInActivityPoints) }</p>
                    <LayoutCurrencyIcon type="small" currency={ offer.activityPointType } />
                </div> }
        </>
    )
}
