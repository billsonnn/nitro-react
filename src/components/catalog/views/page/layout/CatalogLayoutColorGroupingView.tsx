import { ColorConverter } from "@nitrots/nitro-renderer"
import { FC, useMemo, useState } from "react"
import { IPurchasableOffer } from "../../../../../api"
import { Button, LayoutImage } from "../../../../../common"
import { useCatalog } from "../../../../../hooks"
import { CatalogGridOfferView } from "../common/CatalogGridOfferView"
import { CatalogAddOnBadgeWidgetView } from "../widgets/CatalogAddOnBadgeWidgetView"
import { CatalogFirstProductSelectorWidgetView } from "../widgets/CatalogFirstProductSelectorWidgetView"
import { CatalogLimitedItemWidgetView } from "../widgets/CatalogLimitedItemWidgetView"
import { CatalogPurchaseWidgetView } from "../widgets/CatalogPurchaseWidgetView"
import { CatalogSimplePriceWidgetView } from "../widgets/CatalogSimplePriceWidgetView"
import { CatalogSpinnerWidgetView } from "../widgets/CatalogSpinnerWidgetView"
import { CatalogTotalPriceWidget } from "../widgets/CatalogTotalPriceWidget"
import { CatalogViewProductWidgetView } from "../widgets/CatalogViewProductWidgetView"
import { CatalogLayoutProps } from "./CatalogLayout.types"

export interface CatalogLayoutColorGroupViewProps extends CatalogLayoutProps
{

}

export const CatalogLayoutColorGroupingView : FC<CatalogLayoutColorGroupViewProps> = props =>
{
    const { page = null } = props
    const [ colorableItems, setColorableItems ] = useState<Map<string, number[]>>(new Map<string, number[]>())
    const { currentOffer = null, setCurrentOffer = null } = useCatalog()

    const sortByColorIndex = (a: IPurchasableOffer, b: IPurchasableOffer) =>
    {
        if (((!(a.product.furnitureData.colorIndex)) || (!(b.product.furnitureData.colorIndex))))
        {
            return 1
        }
        if (a.product.furnitureData.colorIndex > b.product.furnitureData.colorIndex)
        {
            return 1
        }
        if (a === b)
        {
            return 0
        }
        return -1
    }

    const sortyByFurnitureClassName = (a: IPurchasableOffer, b: IPurchasableOffer) =>
    {
        if (a.product.furnitureData.className > b.product.furnitureData.className)
        {
            return 1
        }
        if (a === b)
        {
            return 0
        }
        return -1
    }

    const selectOffer = (offer: IPurchasableOffer) =>
    {
        offer.activate()
        setCurrentOffer(offer)
    }

    const selectColor = (colorIndex: number, productName: string) =>
    {
        const fullName = `${ productName }*${ colorIndex }`
        const index = page.offers.findIndex(offer => offer.product.furnitureData.fullName === fullName)
        if (index > -1)
        {
            selectOffer(page.offers[index])
        }
    }

    const offers = useMemo(() =>
    {
        const offers: IPurchasableOffer[] = []
        const addedColorableItems = new Map<string, boolean>()
        const updatedColorableItems = new Map<string, number[]>()

        page.offers.sort(sortByColorIndex)

        page.offers.forEach(offer =>
        {
            if(!offer.product) return

            const furniData = offer.product.furnitureData

            if(!furniData || !furniData.hasIndexedColor)
            {
                offers.push(offer)
            }
            else
            {
                const name = furniData.className
                const colorIndex = furniData.colorIndex

                if(!updatedColorableItems.has(name))
                {
                    updatedColorableItems.set(name, [])
                }

                let selectedColor = 0xFFFFFF
                
                if(furniData.colors)
                {
                    for(let color of furniData.colors)
                    {
                        if(color !== 0xFFFFFF) // skip the white colors
                        {
                            selectedColor = color
                        }
                    }

                    if(updatedColorableItems.get(name).indexOf(selectedColor) === -1)
                    {
                        updatedColorableItems.get(name)[colorIndex] = selectedColor
                    }

                }

                if(!addedColorableItems.has(name))
                {
                    offers.push(offer)
                    addedColorableItems.set(name, true)
                }
            }
        })
        offers.sort(sortyByFurnitureClassName)
        setColorableItems(updatedColorableItems)
        return offers
    }, [ page.offers ])

    return (<>
        <CatalogFirstProductSelectorWidgetView />
        <div className="flex-1">
            <div className="relative h-[255px]">
                { !currentOffer &&
                    <div className="flex h-full flex-col items-center justify-center">
                        { !!page.localization.getImage(1) && 
                            <LayoutImage imageUrl={ page.localization.getImage(1) } /> }
                    </div> }
                { currentOffer && 
                    <div className="relative h-[246px]">
                        <CatalogViewProductWidgetView />
                        <CatalogAddOnBadgeWidgetView className="absolute right-1.5 top-1.5 " />
                        <CatalogLimitedItemWidgetView />
                        <p className="absolute left-1.5 top-1.5 text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ currentOffer.localizationName }</p>
                        {!currentOffer.bundlePurchaseAllowed && <CatalogSimplePriceWidgetView className="absolute bottom-1.5 right-1.5 !px-0" /> }
                    </div> }
            </div>
            <div className="illumina-card mb-[3px] h-[100px] w-full overflow-hidden p-1">
                <div className="illumina-scrollbar grid h-full grid-cols-6 grid-rows-[max-content] gap-[3px] [place-content:flex-start]">
                    { (colorableItems.has(currentOffer?.product?.furnitureData?.className)) &&
                        offers.map((offer, index) => <CatalogGridOfferView key={ index } itemActive={ (currentOffer && (currentOffer.product.furnitureData.hasIndexedColor ? currentOffer.product.furnitureData.className === offer.product.furnitureData.className : currentOffer.offerId === offer.offerId)) } offer={ offer } selectOffer={ selectOffer }/>)
                    }
                </div>
            </div>
            <div className="illumina-card h-[50px] w-full overflow-hidden p-1">
                <div className="illumina-scrollbar grid h-full grid-cols-11 grid-rows-[max-content] gap-0.5 [place-content:flex-start]">
                    { (currentOffer && colorableItems.has(currentOffer.product.furnitureData.className)) &&
                        colorableItems.get(currentOffer.product.furnitureData.className).map((color, index) => (
                            <Button key={ index } className={`!h-[22px] !w-[27px] !p-[5px] ${(currentOffer.product.furnitureData.colorIndex === index) ? "!p-1.5" : ""}`} onClick={ event => selectColor(index, currentOffer.product.furnitureData.className) }>
                                <div className={`size-full border ${(currentOffer.product.furnitureData.colorIndex === index) ? "!border-[#00000027]" : "border-[#A4A4A4] dark:border-black"}`} style={ { backgroundColor: ColorConverter.int2rgb(color) } } />
                            </Button>
                        ))
                    }
                </div>
            </div>
        </div>
        <div className="flex h-[57px] flex-col justify-end">
            <div className="mb-[3px] flex items-center justify-between">
                <CatalogSpinnerWidgetView />
                <CatalogTotalPriceWidget />
            </div>
            <CatalogPurchaseWidgetView />
        </div>
    </>)
}
