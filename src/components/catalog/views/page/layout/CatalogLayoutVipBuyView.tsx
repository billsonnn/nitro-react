import { ClubOfferData, GetClubOffersMessageComposer, PurchaseFromCatalogComposer } from "@nitrots/nitro-renderer"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { CatalogPurchaseState, LocalizeText, SendMessageComposer } from "../../../../../api"
import { Button, LayoutCurrencyIcon, LayoutNotificationAlertView } from "../../../../../common"
import { CatalogEvent, CatalogPurchaseFailureEvent, CatalogPurchasedEvent } from "../../../../../events"
import { useCatalog, usePurse, useUiEvent } from "../../../../../hooks"
import { CatalogLayoutProps } from "./CatalogLayout.types"

export const CatalogLayoutVipBuyView: FC<CatalogLayoutProps> = props =>
{
    const [ pendingOffer, setPendingOffer ] = useState<ClubOfferData>(null)
    const [ purchaseState, setPurchaseState ] = useState(CatalogPurchaseState.NONE)
    const { currentPage = null, catalogOptions = null } = useCatalog()
    const { purse = null } = usePurse()
    const { clubOffers = null } = catalogOptions

    const onCatalogEvent = useCallback((event: CatalogEvent) =>
    {
        switch(event.type)
        {
        case CatalogPurchasedEvent.PURCHASE_SUCCESS:
            setPurchaseState(CatalogPurchaseState.NONE)
            return
        case CatalogPurchaseFailureEvent.PURCHASE_FAILED:
            setPurchaseState(CatalogPurchaseState.FAILED)
            return
        }
    }, [])

    useUiEvent(CatalogPurchasedEvent.PURCHASE_SUCCESS, onCatalogEvent)
    useUiEvent(CatalogPurchaseFailureEvent.PURCHASE_FAILED, onCatalogEvent)

    const getOfferText = useCallback((offer: ClubOfferData) =>
    {
        let offerText = ""

        if(offer.months > 0)
        {
            offerText = LocalizeText("catalog.vip.item.header.months", [ "num_months" ], [ offer.months.toString() ])
        }

        if(offer.extraDays > 0)
        {
            if(offerText !== "") offerText += " "
            
            offerText += (" " + LocalizeText("catalog.vip.item.header.days", [ "num_days" ], [ offer.extraDays.toString() ]))
        }

        return offerText
    }, [])

    const getPurchaseHeader = useCallback(() =>
    {
        if(!purse) return ""

        const extensionOrSubscription = (purse.clubDays > 0 || purse.clubPeriods > 0) ? "extension." : "subscription."
        const daysOrMonths = ((pendingOffer.months === 0) ? "days" : "months")
        const daysOrMonthsText = ((pendingOffer.months === 0) ? pendingOffer.extraDays : pendingOffer.months)
        const locale = LocalizeText("catalog.vip.buy.confirm." + extensionOrSubscription + daysOrMonths)

        return locale.replace("%NUM_" + daysOrMonths.toUpperCase() + "%", daysOrMonthsText.toString())
    }, [ pendingOffer, purse ])

    const getPurchaseValidUntil = useCallback(() =>
    {
        let locale = LocalizeText("catalog.vip.buy.confirm.end_date")

        locale = locale.replace("%month%", pendingOffer.month.toString())
        locale = locale.replace("%day%", pendingOffer.day.toString())
        locale = locale.replace("%year%", pendingOffer.year.toString())

        return locale
    }, [ pendingOffer ])

    const getSubscriptionDetails = useMemo(() =>
    {
        const clubDays = purse.clubDays
        const clubPeriods = purse.clubPeriods
        const totalDays = (clubPeriods * 31) + clubDays

        if(totalDays > 0) {
            return (<>
                <p className="mb-3 text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("catalog.vip.extend.title") }</p>
                <p className="text-sm" dangerouslySetInnerHTML={ { __html: LocalizeText("catalog.vip.extend.info", [ "days" ], [ totalDays.toString() ]) } } />
            </>)
        } else {
            return (<>
                <p className="mb-3 text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("catalog.vip.buy.title") }</p>
                <p className="text-sm" dangerouslySetInnerHTML={ { __html: LocalizeText("catalog.vip.buy.info") } } />
            </>)
        }

    }, [ purse ])
    
    const purchaseSubscription = useCallback(() =>
    {
        if(!pendingOffer) return

        setPurchaseState(CatalogPurchaseState.PURCHASE)
        SendMessageComposer(new PurchaseFromCatalogComposer(currentPage.pageId, pendingOffer.offerId, null, 1))
    }, [ pendingOffer, currentPage ])

    const setOffer = useCallback((offer: ClubOfferData) =>
    {
        setPurchaseState(CatalogPurchaseState.CONFIRM)
        setPendingOffer(offer)
    }, [])

    useEffect(() =>
    {
        if(!clubOffers) SendMessageComposer(new GetClubOffersMessageComposer(1))
    }, [ clubOffers ])
    
    const PurchaseDialog = () => (
        <LayoutNotificationAlertView onClose={() => setPurchaseState(CatalogPurchaseState.NONE)} title={ LocalizeText("catalog.purchase_confirmation.title") } style={{ width: 369 }}>
            <div className="mb-[17px] flex gap-[9px]">
                <div className="mb-1">
                    <i className="catalog-club-preview block h-10 w-[68px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-209px_-212px]" />
                </div>
                <div className="flex w-full flex-col gap-3">
                    <p className="w-full text-clip text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ getPurchaseHeader() }</p>
                    <p className="text-sm text-black">{ getPurchaseValidUntil() }</p>
                    <div className="flex items-center gap-[5px]">
                        <p className="text-sm text-black">{LocalizeText("catalog.purchase.confirmation.dialog.cost")}</p>
                        <div className="flex items-center">
                            { (pendingOffer.priceCredits > 0) &&
                            <div className="flex items-center justify-end gap-1">
                                <p className="font-sepriceActivityPointsmibold text-sm !leading-3">{ (pendingOffer.priceCredits) }</p>
                                <LayoutCurrencyIcon type="big" currency={ -1 } />
                            </div> }
                            { (pendingOffer.priceActivityPoints > 0) && <>
                                { (pendingOffer.priceCredits > 0) && (pendingOffer.priceActivityPoints > 0) && <p className="mx-1 text-sm font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">+</p> }
                                <div className="flex items-center justify-end gap-1">
                                    <p className="text-sm font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ (pendingOffer.priceActivityPoints) }</p>
                                    <LayoutCurrencyIcon type="big" currency={ pendingOffer.priceActivityPointsType } />
                                </div>
                            </> }
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between gap-[76px]">
                <Button className="w-full" variant="primary" onClick={() => setPurchaseState(CatalogPurchaseState.NONE)}>{ LocalizeText("generic.cancel") }</Button>
                <Button className="w-full" variant="success" disabled={purchaseState === CatalogPurchaseState.FAILED} onClick={() => purchaseSubscription()}>{ LocalizeText("catalog.club.buy.subscribe") }</Button>
            </div>
        </LayoutNotificationAlertView>
    )

    return (
        <>
            {purchaseState === CatalogPurchaseState.CONFIRM && <PurchaseDialog /> }
            <div className="flex h-full flex-col">
                <div className="flex">
                    { currentPage.localization.getImage(1) && <img src={ currentPage.localization.getImage(1) } className="" /> }
                    <div className="ml-[38px]">
                        {getSubscriptionDetails}
                    </div>
                </div>
                <div className="flex flex-1 flex-col justify-between">
                    <div className="flex flex-col gap-1">
                        { clubOffers && (clubOffers.length > 0) && clubOffers.map((offer, index) => (
                            <div key={ index } className="h-[75px] w-80 bg-[url('/client-assets/images/catalogue/hc-item-bg.png?v=2451779')] p-[5px] pb-2 dark:bg-[url('/client-assets/images/catalogue/hc-item-dark-bg.png?v=2451779')]">
                                <div className="flex h-[25px] w-[310px] items-center px-[7px] py-1">
                                    <i className="block h-[17px] w-[31px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-273px_-84px]" />
                                    <p className="ml-[25px] text-sm font-semibold text-white [text-shadow:_0_1px_0_#959595]">{ getOfferText(offer) }</p>
                                </div>
                                <div className="flex items-center px-0.5 pt-[7px]">
                                    <div className="flex w-[122px] items-center">
                                        { (offer.priceCredits > 0) &&
                                            <div className="flex items-center gap-1">
                                                <p className="text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ offer.priceCredits }</p>
                                                <LayoutCurrencyIcon type="big" currency={ -1 } />
                                            </div> }
                                        { (offer.priceActivityPoints > 0) && <>
                                            <div className="flex items-center gap-1">
                                                <p className="text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">+ { offer.priceActivityPoints }</p>
                                                <LayoutCurrencyIcon type="big" currency={ offer.priceActivityPointsType } />
                                            </div>
                                        </>}
                                    </div>
                                    <Button variant="success" onClick={ () => setOffer(offer) }>{ LocalizeText("buy") }</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="px-[35px] text-center text-sm" dangerouslySetInnerHTML={ { __html: LocalizeText("catalog.vip.buy.hccenter") } }></p>
                </div>
            </div>
        </>
    )
}
