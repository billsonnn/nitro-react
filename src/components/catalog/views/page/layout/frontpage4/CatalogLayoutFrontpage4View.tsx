import { FrontPageItem } from "@nitrots/nitro-renderer"
import { FC, useCallback, useEffect } from "react"
import { CreateLinkEvent } from "../../../../../../api"
import { useCatalog } from "../../../../../../hooks"
import { CatalogRedeemVoucherView } from "../../common/CatalogRedeemVoucherView"
import { CatalogLayoutProps } from "../CatalogLayout.types"
import { CatalogLayoutFrontPageItemView } from "./CatalogLayoutFrontPageItemView"

export const CatalogLayoutFrontpage4View: FC<CatalogLayoutProps> = props =>
{
    const { page = null, hideNavigation = null } = props
    const { frontPageItems = [] } = useCatalog()

    const selectItem = useCallback((item: FrontPageItem) =>
    {
        switch(item.type)
        {
        case FrontPageItem.ITEM_CATALOGUE_PAGE:
            CreateLinkEvent(`catalog/open/${ item.catalogPageLocation }`)
            return
        case FrontPageItem.ITEM_PRODUCT_OFFER:
            CreateLinkEvent(`catalog/open/${ item.productOfferId }`)
            return
        }
    }, [])

    useEffect(() =>
    {
        hideNavigation()
    }, [ page, hideNavigation ])

    return (
        <div className="flex w-full translate-x-[-41px] gap-[7px]">
            <div className="h-[460px] w-[184px]">
                { frontPageItems[0] &&
                    <CatalogLayoutFrontPageItemView className="h-[460px] w-[184px]" item={ frontPageItems[0] } onClick={ event => selectItem(frontPageItems[0]) } /> }
            </div>
            <div className="flex flex-col gap-[7px]">
                { frontPageItems[1] &&
                    <CatalogLayoutFrontPageItemView className="h-[126px] w-[356px] px-[5px]" item={ frontPageItems[1] } onClick={ event => selectItem(frontPageItems[1]) } /> }
                { frontPageItems[2] &&
                    <CatalogLayoutFrontPageItemView className="h-[126px] w-[356px] px-[5px]" item={ frontPageItems[2] } onClick={ event => selectItem(frontPageItems[2]) } /> }
                { frontPageItems[3] &&
                    <CatalogLayoutFrontPageItemView className="h-[126px] w-[356px] px-[5px]" item={ frontPageItems[3] } onClick={ event => selectItem(frontPageItems[3]) } /> }
                <CatalogRedeemVoucherView text={ page.localization.getText(1) } />
            </div>
        </div>
    )
}
