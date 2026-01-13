import { FC, useCallback, useMemo } from "react"
import { GetImageIconUrlForProduct, LocalizeText, MarketPlaceOfferState, MarketplaceOfferData, ProductTypeEnum } from "../../../../../../api"
import { Button, LayoutGridItem } from "../../../../../../common"

export interface MarketplaceItemViewProps
{
    offerData: MarketplaceOfferData;
    type?: number;
    onClick(offerData: MarketplaceOfferData): void;
}

export const OWN_OFFER = 1
export const PUBLIC_OFFER = 2

export const CatalogLayoutMarketplaceItemView: FC<MarketplaceItemViewProps> = props =>
{
    const { offerData = null, type = PUBLIC_OFFER, onClick = null } = props
    
    const getMarketplaceOfferTitle = useMemo(() =>
    {
        if(!offerData) return ""

        // desc
        return LocalizeText(((offerData.furniType === 2) ? "wallItem" : "roomItem") + `.name.${ offerData.furniId }`)
    }, [ offerData ])

    const offerTime = useCallback(() =>
    {
        if(!offerData) return ""

        if(offerData.status === MarketPlaceOfferState.SOLD) return LocalizeText("catalog.marketplace.offer.sold")

        if(offerData.timeLeftMinutes <= 0) return LocalizeText("catalog.marketplace.offer.expired")
        
        const time = Math.max(1, offerData.timeLeftMinutes)
        const hours = Math.floor(time / 60)
        const minutes = time - (hours * 60)

        let text = minutes + " " + LocalizeText("catalog.marketplace.offer.minutes")
        if(hours > 0)
        {
            text = hours + " " + LocalizeText("catalog.marketplace.offer.hours") + " " + text
        }

        return LocalizeText("catalog.marketplace.offer.time_left", [ "time" ], [ text ])
    }, [ offerData ])

    return (
        <LayoutGridItem itemAbsolute={true} className="!h-auto !flex-row !justify-start p-[9px_5px_5px_14px]">
            <i className="size-10">
                <LayoutGridItem column={ false } itemImage={ GetImageIconUrlForProduct(((offerData.furniType === MarketplaceOfferData.TYPE_FLOOR) ? ProductTypeEnum.FLOOR : ProductTypeEnum.WALL), offerData.furniId, offerData.extraData) } itemUniqueNumber={ offerData.isUniqueLimitedItem ? offerData.stuffData.uniqueNumber : 0 } />
            </i>
            <div className="flex w-full items-end justify-between">
                <div className="flex flex-col pl-4">
                    <p className="mb-2.5 text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ getMarketplaceOfferTitle }</p>
                    { (type === OWN_OFFER) &&
                        <>
                            <p className="mb-[3px] text-xs !leading-3">{ LocalizeText("catalog.marketplace.offer.price_own_item", [ "price" ], [ offerData.price.toString() ]) }</p>
                            <p className="text-xs !leading-3">{ offerTime() }</p>
                        </> }
                    { (type === PUBLIC_OFFER) &&
                        <>
                            <p className="mb-[3px] text-xs !leading-3">{ LocalizeText("catalog.marketplace.offer.price_public_item", [ "price", "average" ], [ offerData.price.toString(), ((offerData.averagePrice > 0) ? offerData.averagePrice.toString() : "-") ]) }</p>
                            <p className="text-xs !leading-3">{ LocalizeText("catalog.marketplace.offer_count", [ "count" ], [ offerData.offerCount.toString() ]) }</p>
                        </> }
                </div>
                <div className="z-20 flex flex-col">
                    { ((type === OWN_OFFER) && (offerData.status !== MarketPlaceOfferState.SOLD)) &&
                        <Button className="!h-[22px] !px-3" onClick={ () => onClick(offerData) }>
                            { LocalizeText("catalog.marketplace.offer.pick") }
                        </Button> }
                    { type === PUBLIC_OFFER &&
                        <div className="flex flex-col gap-[3px]">
                            <Button className="!h-[22px] !px-3" onClick={ () => onClick(offerData) }>
                                { LocalizeText("buy") }
                            </Button>
                            <Button className="!h-[22px] !px-3" disabled>
                                { LocalizeText("catalog.marketplace.view_more") }
                            </Button>
                        </div> }
                </div>
            </div>
        </LayoutGridItem>
    )
}
