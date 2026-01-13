import { FC } from "react"
import { LayoutImage } from "../../../../../common"
import { useCatalog } from "../../../../../hooks"
import { CatalogBadgeSelectorWidgetView } from "../widgets/CatalogBadgeSelectorWidgetView"
import { CatalogFirstProductSelectorWidgetView } from "../widgets/CatalogFirstProductSelectorWidgetView"
import { CatalogItemGridWidgetView } from "../widgets/CatalogItemGridWidgetView"
import { CatalogPurchaseWidgetView } from "../widgets/CatalogPurchaseWidgetView"
import { CatalogSimplePriceWidgetView } from "../widgets/CatalogSimplePriceWidgetView"
import { CatalogViewProductWidgetView } from "../widgets/CatalogViewProductWidgetView"
import { CatalogLayoutProps } from "./CatalogLayout.types"

export const CatalogLayoutBadgeDisplayView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props
    const { currentOffer = null } = useCatalog()

    return (
        <>
            <CatalogFirstProductSelectorWidgetView />
            <div className="relative flex h-full flex-col">
                <div className="flex-1">
                    { !currentOffer &&
                        <div className="flex h-full flex-col items-center justify-center">
                            { !!page.localization.getImage(1) && 
                                <LayoutImage imageUrl={ page.localization.getImage(1) } /> }
                        </div> }
                    { currentOffer && <div className="relative h-[246px]">
                        <CatalogViewProductWidgetView />
                        <p className="absolute left-1.5 top-1.5 text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ currentOffer.localizationName }</p>
                        <CatalogSimplePriceWidgetView className="absolute bottom-1.5 right-1.5 !px-0" />
                    </div> }
                    <div className="mt-[15px] flex h-[175px] justify-between gap-1.5">
                        <div className="illumina-card h-full w-1/2 overflow-hidden p-1">
                            <CatalogItemGridWidgetView className="!grid-cols-3" />
                        </div>
                        <div className="illumina-card h-full w-1/2 overflow-hidden p-1">
                            <CatalogBadgeSelectorWidgetView />
                        </div>
                    </div>
                </div>
                <div className="mt-2 flex h-[30px] flex-col justify-end">
                    <CatalogPurchaseWidgetView />
                </div>
            </div>
        </>
    )
}
