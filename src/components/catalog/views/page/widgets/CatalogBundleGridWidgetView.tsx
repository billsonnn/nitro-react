import { FC, useEffect, useRef } from "react"
import { LayoutGridItem } from "../../../../../common"
import { useCatalog } from "../../../../../hooks"

export const CatalogBundleGridWidgetView: FC<{}> = props =>
{
    const { currentOffer = null } = useCatalog()
    const elementRef = useRef<HTMLDivElement>()

    const filteredProducts = currentOffer?.products.filter(product => product?.productType !== "b")

    useEffect(() =>
    {
        if(elementRef && elementRef.current) elementRef.current.scrollTop = 0
    }, [ currentOffer ])

    if(!currentOffer) return null

    return (
        <div className="illumina-scrollbar grid size-full grid-cols-4 grid-rows-[30px] content-start gap-[9px] p-1">
            {filteredProducts.map((product, index) => (
                <LayoutGridItem
                    key={index}
                    className="!h-[30px] w-[30px]"
                    itemImage={product.getIconUrl()}
                    itemBundle={true}
                    itemCount={product.productCount}
                />
            ))}
        </div>
    )
}
