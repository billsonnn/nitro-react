import { FC } from "react"
import { ProductTypeEnum } from "../../../../../api"
import { LayoutImage } from "../../../../../common"
import { useCatalog } from "../../../../../hooks"
import { CatalogAddOnBadgeWidgetView } from "../widgets/CatalogAddOnBadgeWidgetView"
import { CatalogItemGridWidgetView } from "../widgets/CatalogItemGridWidgetView"
import { CatalogLimitedItemWidgetView } from "../widgets/CatalogLimitedItemWidgetView"
import { CatalogPurchaseWidgetView } from "../widgets/CatalogPurchaseWidgetView"
import { CatalogSimplePriceWidgetView } from "../widgets/CatalogSimplePriceWidgetView"
import { CatalogSpinnerWidgetView } from "../widgets/CatalogSpinnerWidgetView"
import { CatalogTotalPriceWidget } from "../widgets/CatalogTotalPriceWidget"
import { CatalogViewProductWidgetView } from "../widgets/CatalogViewProductWidgetView"
import { CatalogLayoutProps } from "./CatalogLayout.types"

export const CatalogLayoutDefaultView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props
    const { currentOffer = null, currentPage = null } = useCatalog()

    return (<div className="flex h-full flex-col justify-between">
        <div>
            <div className="relative h-[255px]">
                { !currentOffer &&
                    <div className="flex h-full flex-col items-center justify-center">
                        { !!page.localization.getImage(1) && 
                            <LayoutImage imageUrl={ page.localization.getImage(1) } /> }
                    </div> }
                { currentOffer && 
                    <div className="relative h-[246px]">
                        { (currentOffer.product.productType !== ProductTypeEnum.BADGE) && <>
                            <CatalogViewProductWidgetView page={ page } />
                            <CatalogAddOnBadgeWidgetView className="absolute right-1.5 top-1.5 " />
                            <CatalogLimitedItemWidgetView />
                            <p className="absolute left-1.5 top-1.5 text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ currentOffer.localizationName }</p>
                            {!currentOffer.bundlePurchaseAllowed && <CatalogSimplePriceWidgetView className="absolute bottom-1.5 right-1.5 !px-0" /> }
                        </> }
                        { (currentOffer.product.productType === ProductTypeEnum.BADGE) &&
                            <div className="flex h-full items-center justify-center">
                                <CatalogAddOnBadgeWidgetView className="scale-150" />
                            </div> }
                    </div> }
            </div>
            <div className="illumina-card h-[155px] w-full overflow-hidden p-1">
                <CatalogItemGridWidgetView />
            </div>
        </div>
        <div className="flex h-[57px] flex-col justify-end">
            <div className="mb-[3px] flex items-center justify-between">
                <CatalogSpinnerWidgetView />
                <CatalogTotalPriceWidget />
            </div>
            <CatalogPurchaseWidgetView />
        </div>
    </div>)
}
