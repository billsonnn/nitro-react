import { FC } from "react"
import { CatalogLayoutProps } from "./CatalogLayout.types"

export const CatalogLayoutInfoLoyaltyView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props
    
    return (
        <div className="illumina-catalogue-info size-full px-5 py-2.5">
            <div className="illumina-scrollbar h-full max-h-full text-white">
                <div className="mb-3 flex items-center gap-[11px]">
                    <p dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
                </div>
            </div>
        </div>
    )
}
