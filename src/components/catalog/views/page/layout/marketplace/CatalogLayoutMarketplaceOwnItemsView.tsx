import { CancelMarketplaceOfferMessageComposer, GetMarketplaceOwnOffersMessageComposer, MarketplaceCancelOfferResultEvent, MarketplaceOwnOffersEvent, RedeemMarketplaceOfferCreditsMessageComposer } from "@nitrots/nitro-renderer"
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { LocalizeText, MarketPlaceOfferState, MarketplaceOfferData, NotificationAlertType, SendMessageComposer } from "../../../../../../api"
import { Button } from "../../../../../../common"
import { useMessageEvent, useNotification } from "../../../../../../hooks"
import { CatalogLayoutProps } from "../CatalogLayout.types"
import { CatalogLayoutMarketplaceItemView, OWN_OFFER } from "./CatalogLayoutMarketplaceItemView"

export const CatalogLayoutMarketplaceOwnItemsView: FC<CatalogLayoutProps> = props =>
{
    const [ creditsWaiting, setCreditsWaiting ] = useState(0)
    const [ offers, setOffers ] = useState<MarketplaceOfferData[]>([])
    const { simpleAlert = null } = useNotification()

    const containerRef = useRef<HTMLDivElement>(null)

    useMessageEvent<MarketplaceOwnOffersEvent>(MarketplaceOwnOffersEvent, event =>
    {
        const parser = event.getParser()

        if(!parser) return

        const offers = parser.offers.map(offer =>
        {
            const newOffer = new MarketplaceOfferData(offer.offerId, offer.furniId, offer.furniType, offer.extraData, offer.stuffData, offer.price, offer.status, offer.averagePrice, offer.offerCount)

            newOffer.timeLeftMinutes = offer.timeLeftMinutes

            return newOffer
        })

        setCreditsWaiting(parser.creditsWaiting)
        setOffers(offers) 
    })

    useMessageEvent<MarketplaceCancelOfferResultEvent>(MarketplaceCancelOfferResultEvent, event =>
    {
        const parser = event.getParser()

        if(!parser) return

        if(!parser.success)
        {
            simpleAlert(LocalizeText("catalog.marketplace.cancel_failed"), NotificationAlertType.DEFAULT, null, null, LocalizeText("catalog.marketplace.operation_failed.topic"))

            return
        }

        setOffers(prevValue => prevValue.filter(value => (value.offerId !== parser.offerId)))
    })

    const soldOffers = useMemo(() =>
    {
        return offers.filter(value => (value.status === MarketPlaceOfferState.SOLD))
    }, [ offers ])
    
    const redeemSoldOffers = useCallback(() =>
    {
        setOffers(prevValue =>
        {
            const idsToDelete = soldOffers.map(value => value.offerId)

            return prevValue.filter(value => (idsToDelete.indexOf(value.offerId) === -1))
        })
        
        SendMessageComposer(new RedeemMarketplaceOfferCreditsMessageComposer())
    }, [ soldOffers ])

    const takeItemBack = (offerData: MarketplaceOfferData) =>
    {
        SendMessageComposer(new CancelMarketplaceOfferMessageComposer(offerData.offerId))
    }

    useEffect(() =>
    {
        SendMessageComposer(new GetMarketplaceOwnOffersMessageComposer())
    }, [])

    useEffect(() => {
        const containerHeight = containerRef.current?.offsetHeight || 0
        const gridContainer = document.querySelector(".grid-container") as HTMLElement
        gridContainer.style.maxHeight = `calc(100% - ${containerHeight + 50}px)`
    }, [ containerRef ])

    return (
        <div className="flex h-full flex-col">
            <div ref={containerRef} className="min-h-[90px]">
                <p className="text-sm italic">
                    { (creditsWaiting <= 0) 
                        ? LocalizeText("catalog.marketplace.redeem.no_sold_items")
                        : LocalizeText("catalog.marketplace.redeem.get_credits", [ "count", "credits" ], [ soldOffers.length.toString(), creditsWaiting.toString() ]) }
                </p>
                <div className="mt-3.5 flex flex-col items-center">
                    <Button className="mt-1" onClick={ redeemSoldOffers } disabled={creditsWaiting <= 0}>
                        { LocalizeText("catalog.marketplace.offer.redeem") }
                    </Button>
                </div>
            </div>
            <div className="mt-[9px] flex h-full flex-col">
                <p className="text-xs">
                    { (creditsWaiting > 0)
                        ? LocalizeText("catalog.marketplace.items_found", [ "count" ], [ offers.length.toString() ])
                        : LocalizeText("catalog.marketplace.no_items")}
                </p>
                <div className="grid-container illumina-scrollbar mt-[13px] grid flex-1 grid-cols-1 grid-rows-[max-content] gap-[3px]">
                    { (offers.length > 0) && offers.map(offer => <CatalogLayoutMarketplaceItemView key={ offer.offerId } offerData={ offer } type={ OWN_OFFER } onClick={ takeItemBack } />) }
                </div>
            </div>
        </div>
    )
}
