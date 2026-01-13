import { FC, useMemo } from "react"
import { FurniCategory, Offer, ProductTypeEnum } from "../../../../../api"
import { LayoutAvatarImageView, LayoutFurniImageView, LayoutGridItem } from "../../../../../common"
import { useCatalog } from "../../../../../hooks"
import { CatalogAddOnBadgeWidgetView } from "./CatalogAddOnBadgeWidgetView"

interface PurchaseViewProductWidgetViewProps
{
    isPet: boolean;
}

export const PurchaseViewProductWidgetView: FC<PurchaseViewProductWidgetViewProps> = props =>
{
    const { isPet = false } = props
    const { currentOffer = null } = useCatalog()

    const iconUrl = useMemo(() =>
    {
        if(currentOffer.pricingModel === Offer.PRICING_MODEL_BUNDLE)
        {
            return null
        }

        return currentOffer.product.getIconUrl(currentOffer)
    }, [ currentOffer ])

    if(currentOffer.pricingModel === Offer.PRICING_MODEL_BUNDLE)
    {
        return (
            <div className="flex size-full items-center justify-center">
                { (currentOffer.products.length > 0) &&
                    <LayoutGridItem className="w-10 ![border-image:none]" itemImage={ currentOffer.products[0].getIconUrl(currentOffer) } itemCount={ currentOffer.products[0].productCount } />
                }
            </div>
        )
    }

    if(currentOffer.product.productType === ProductTypeEnum.BADGE)
    {
        return (
            <CatalogAddOnBadgeWidgetView />
        )
    }
    
    if(currentOffer.product.productType === ProductTypeEnum.ROBOT)
    {
        return (
            <LayoutAvatarImageView figure={ currentOffer.product.extraParam } direction={ 3 } /> 
        )
    }

    if((currentOffer.product.furnitureData?.specialType === FurniCategory.FLOOR) || (currentOffer.product.furnitureData?.specialType === FurniCategory.WALL_PAPER) || (currentOffer.product.furnitureData?.specialType === FurniCategory.LANDSCAPE))
    {
        return (
            <i className="block size-[50px] bg-center bg-no-repeat" style={{ backgroundImage: `url(${iconUrl})` }} />
        )
    }

    if(isPet) {
        return <i className="h-[75px] w-[66px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-142px_-212px]" />
    }

    return <LayoutFurniImageView productType={ currentOffer.product.productType } productClassId={ currentOffer.product.productClassId } />
}
