import { FC } from "react"
import { useCatalog } from "../../../../../hooks"
import { CatalogFirstProductSelectorWidgetView } from "../widgets/CatalogFirstProductSelectorWidgetView"
import { CatalogGuildBadgeWidgetView } from "../widgets/CatalogGuildBadgeWidgetView"
import { CatalogGuildSelectorWidgetView } from "../widgets/CatalogGuildSelectorWidgetView"
import { CatalogItemGridWidgetView } from "../widgets/CatalogItemGridWidgetView"
import { CatalogSimplePriceWidgetView } from "../widgets/CatalogSimplePriceWidgetView"
import { CatalogViewProductWidgetView } from "../widgets/CatalogViewProductWidgetView"
import { CatalogLayoutProps } from "./CatalogLayout.types"

export const CatalogLayouGuildCustomFurniView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props
    const { currentOffer = null } = useCatalog()
    
    return (
        <>
            <CatalogFirstProductSelectorWidgetView />
            <div className="flex-1">
                <div className="relative h-[255px]">
                    <div className="relative h-[246px]">
                        <CatalogViewProductWidgetView />
                        <p className="absolute left-1.5 top-1.5 text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ currentOffer?.localizationName }</p>
                        <CatalogGuildBadgeWidgetView className="absolute bottom-[62px] right-[13px]" />
                        <CatalogSimplePriceWidgetView className="absolute bottom-1.5 right-1.5 !px-0" />
                    </div>
                </div>
                <div className="illumina-card h-[125px] w-full overflow-hidden p-1">
                    <CatalogItemGridWidgetView />
                </div>
            </div>
            <CatalogGuildSelectorWidgetView />
        </>
    )
}
