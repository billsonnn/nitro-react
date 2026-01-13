import { FC, useEffect, useState } from "react"
import { useCatalog } from "../../../../../hooks"
import { CatalogFirstProductSelectorWidgetView } from "../widgets/CatalogFirstProductSelectorWidgetView"
import { CatalogItemSingleWidgetView } from "../widgets/CatalogItemSingleWidgetView"
import { CatalogPurchaseWidgetView } from "../widgets/CatalogPurchaseWidgetView"
import { CatalogLayoutProps } from "./CatalogLayout.types"

export const CatalogLayoutTrophiesView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props
    const [ trophyText, setTrophyText ] = useState<string>("")
    const { currentOffer = null, setPurchaseOptions = null } = useCatalog()

    useEffect(() =>
    {
        if(!currentOffer) return

        setPurchaseOptions(prevValue =>
        {
            const newValue = { ...prevValue }

            newValue.extraData = trophyText

            return newValue
        })
    }, [ currentOffer, trophyText, setPurchaseOptions ])

    return (<>
        <CatalogFirstProductSelectorWidgetView />
        <div className="flex flex-1 flex-col">
            <p className="flex-1 text-sm" dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
            <CatalogItemSingleWidgetView />
            <textarea className="illumina-input mt-[15px] h-[83px] w-full p-[9px] font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" spellCheck={ false } maxLength={ 300 } defaultValue={ trophyText || "" } onChange={ event => setTrophyText(event.target.value) } />
        </div>
        <div className="flex h-[57px] flex-col justify-end">
            <CatalogPurchaseWidgetView />
        </div>
    </>)
}
