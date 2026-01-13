import { FC } from "react"
import { CreateLinkEvent, LocalizeText } from "../../../../../api"
import { Button } from "../../../../../common/Button"
import { CatalogLayoutProps } from "./CatalogLayout.types"

export const CatalogLayouGuildFrontpageView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props
    
    return (
        <>
            <div className="pt-3">
                <p className="mb-6 font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" dangerouslySetInnerHTML={ { __html: page.localization.getText(2) } } />
                <p className="text-sm" dangerouslySetInnerHTML={ { __html: page.localization.getText(1) } } />
            </div>
            <div className="mt-[114px] flex justify-center">
                <Button className="!h-8 !px-6 !text-[13px]" onClick={ () => CreateLinkEvent("groups/create") }>
                    { LocalizeText("catalog.start.guild.purchase.button") }
                </Button>
            </div>
        </>
    )
}
