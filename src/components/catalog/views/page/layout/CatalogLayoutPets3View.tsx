import { FC } from "react"
import { CatalogLayoutProps } from "./CatalogLayout.types"

export const CatalogLayoutPets3View: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props

    const imageUrl = page.localization.getImage(1)
    
    return (
        <div className="illumina-catalogue-info size-full px-5 py-2.5">
            <div className="illumina-scrollbar h-full max-h-full text-white">
                <div className="mb-3 flex items-center gap-[11px]">
                    { imageUrl && <img src={ imageUrl } className="" /> }
                    <p className="text-lg font-semibold [text-shadow:_0_1px_0_#a1b6be] dark:[text-shadow:_0_1px_0_#33312b]" dangerouslySetInnerHTML={ { __html: page.localization.getText(1) } } />
                </div>
                <p className="pb-6 text-sm" dangerouslySetInnerHTML={ { __html: page.localization.getText(2) } } />
                <p className="text-sm font-semibold [text-shadow:_0_1px_0_#a1b6be] dark:[text-shadow:_0_1px_0_#33312b]" dangerouslySetInnerHTML={ { __html: page.localization.getText(3) } } />
            </div>
        </div>
    )
}
