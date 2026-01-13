import { NitroPoint } from "@nitrots/nitro-renderer"
import { FC, useEffect } from "react"
import { useCatalog } from "../../../../../hooks"
import { CatalogPurchaseWidgetView } from "../widgets/CatalogPurchaseWidgetView"
import { CatalogSimplePriceWidgetView } from "../widgets/CatalogSimplePriceWidgetView"
import { CatalogSpacesWidgetView } from "../widgets/CatalogSpacesWidgetView"
import { CatalogViewProductWidgetView } from "../widgets/CatalogViewProductWidgetView"
import { CatalogLayoutProps } from "./CatalogLayout.types"

export const CatalogLayoutSpacesView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props
    const { currentOffer = null, roomPreviewer = null } = useCatalog()

    useEffect(() =>
    {
        roomPreviewer.updatePreviewObjectBoundingRectangle(new NitroPoint())
    }, [ roomPreviewer ])

    return (
        <>
            <div className="flex-1">
                { currentOffer &&
                    <div className="relative h-60">
                        <CatalogViewProductWidgetView isRoom={ true } isBackground={ false } />
                        <p className="absolute left-2 top-2 text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ currentOffer.localizationName }</p>
                        <CatalogSimplePriceWidgetView className="absolute bottom-1.5 right-1.5 !px-0" />
                    </div> }
                <CatalogSpacesWidgetView />
            </div>
            <div className="mt-2 flex h-[35px] flex-col justify-end">
                <CatalogPurchaseWidgetView />
            </div>
        </>
    )
}
