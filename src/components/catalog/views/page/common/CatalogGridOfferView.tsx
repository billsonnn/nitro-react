import { MouseEventType } from "@nitrots/nitro-renderer"
import { FC, MouseEvent, useMemo, useState } from "react"
import { IPurchasableOffer, Offer, ProductTypeEnum } from "../../../../../api"
import { LayoutAvatarImageView, LayoutGridItem, LayoutGridItemProps } from "../../../../../common"
import { useCatalog, useInventoryFurni } from "../../../../../hooks"
import { CatalogPriceGridDisplayWidgetView } from "../widgets/CatalogPriceGridDisplayWidgetViev"

interface CatalogGridOfferViewProps extends LayoutGridItemProps
{
    offer: IPurchasableOffer;
    selectOffer: (offer: IPurchasableOffer) => void;
}

export const CatalogGridOfferView: FC<CatalogGridOfferViewProps> = props =>
{
    const { offer = null, selectOffer = null, itemActive = false, ...rest } = props
    const [ isMouseDown, setMouseDown ] = useState(false)
    const { requestOfferToMover = null } = useCatalog()
    const { isVisible = false } = useInventoryFurni()

    const iconUrl = useMemo(() =>
    {
        if(offer.pricingModel === Offer.PRICING_MODEL_BUNDLE)
        {
            return null
        }

        return offer.product.getIconUrl(offer)
    }, [ offer ])

    const onMouseEvent = (event: MouseEvent) =>
    {
        switch(event.type)
        {
        case MouseEventType.MOUSE_DOWN:
            selectOffer(offer)
            setMouseDown(true)
            return
        case MouseEventType.MOUSE_UP:
            setMouseDown(false)
            return
        case MouseEventType.ROLL_OUT:
            if(!isMouseDown || !itemActive || !isVisible) return

            requestOfferToMover(offer)
            return
        }
    }

    const product = offer.product

    if(!product) return null

    return (
        <LayoutGridItem className="h-auto !justify-start p-[3px]" itemImage={ iconUrl } itemAbsolute={ (offer.product.productType === ProductTypeEnum.ROBOT) } itemCount={ ((offer.pricingModel === Offer.PRICING_MODEL_MULTI) ? product.productCount : 1) } itemUniqueSoldout={ (product.uniqueLimitedItemSeriesSize && !product.uniqueLimitedItemsLeft) } itemUniqueNumber={ product.uniqueLimitedItemSeriesSize } itemActive={ itemActive } onMouseDown={ onMouseEvent } onMouseUp={ onMouseEvent } onMouseOut={ onMouseEvent } { ...rest }>
            { (offer.product.productType === ProductTypeEnum.ROBOT) &&
                <div className="relative !size-9">
                    <LayoutAvatarImageView className="!absolute -left-1.5 -top-3 scale-75 !bg-[-26px_-33px]" figure={ offer.product.extraParam } headOnly={ true } direction={ 3 } /> 
                </div> }
            <div className="flex w-full flex-col gap-1 pb-[3px] pr-[3px] pt-[5px]">
                <CatalogPriceGridDisplayWidgetView offer={ offer } />
            </div>
        </LayoutGridItem>
    )
}
