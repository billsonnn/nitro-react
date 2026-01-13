import { FC } from "react"
import { CatalogAddOnBadgeWidgetView } from "../widgets/CatalogAddOnBadgeWidgetView"
import { CatalogBundleGridWidgetView } from "../widgets/CatalogBundleGridWidgetView"
import { CatalogFirstProductSelectorWidgetView } from "../widgets/CatalogFirstProductSelectorWidgetView"
import { CatalogPurchaseWidgetView } from "../widgets/CatalogPurchaseWidgetView"
import { CatalogSimplePriceWidgetView } from "../widgets/CatalogSimplePriceWidgetView"
import { CatalogLayoutProps } from "./CatalogLayout.types"

export const CatalogLayoutSingleBundleView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props
    return (
        <>
            <CatalogFirstProductSelectorWidgetView />
            <div className="flex-1">
                <div className="h-20 py-2.5">
                    <p className="text-sm" dangerouslySetInnerHTML={ { __html: page.localization.getText(2) } } />
                </div>
                <div className="">
                    <div className="flex h-[287px] gap-[7px]">
                        <div className="relative w-[150px]">
                            <img alt="" className="mt-14" src={ page.localization.getImage(1) } />
                            <CatalogAddOnBadgeWidgetView className="absolute left-0 top-2" />
                            <CatalogSimplePriceWidgetView className="absolute right-0 top-2" />
                        </div>
                        <div className="relative">
                            <p className="absolute bottom-[calc(100%+8px)] font-semibold italic text-[#bb3947] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
                            <div className="illumina-card h-full w-[186px] overflow-hidden">
                                <CatalogBundleGridWidgetView />
                            </div>
                        </div>
                    </div>
                </div>
                {page.localization.getText(3) &&
                    <div className="illumina-catalogue-text2 mt-5 px-[53px] py-[13px]">
                        <p className="text-center text-sm font-semibold text-[#333333] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" dangerouslySetInnerHTML={ { __html: page.localization.getText(3) } } />
                    </div> }
            </div>
            <div className="mt-2 flex h-[35px] flex-col justify-end">
                <CatalogPurchaseWidgetView />
            </div>
        </>
    )
}
